import { useState, useEffect } from "react";
import { UploadCloud, User } from "lucide-react";
import axios from "axios";
import jsPDF from "jspdf";
export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [lastUploadTime, setLastUploadTime] = useState("");
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [below75, setBelow75] = useState([]);
  const [department, setDepartment] = useState("Information Technology");
  const [uploadMonth, setUploadMonth] = useState("");
  const [yearSem, setYearSem] = useState("III - I");
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const [loginProgress, setLoginProgress] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setShowLoginMessage(true);
      setLoginProgress(0);
      let elapsed = 0;
      const interval = setInterval(() => {
        elapsed += 100;
        setLoginProgress((elapsed / 10000) * 100);
      }, 100);
      const timer = setTimeout(() => {
        setShowLoginMessage(false);
        clearInterval(interval);
      }, 10000);
      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }

    const fetchLastUpload = async () => {
      try {
        const res = await axios.get("https://attendence-separator.onrender.com/last-upload");
        if (res.data.uploadedAt) {
          const uploadedDate = new Date(res.data.uploadedAt);
          const formatted = uploadedDate.toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          });
          setLastUploadTime(formatted);
          const monthName = uploadedDate.toLocaleString("default", {
            month: "long",
          });
          setUploadMonth(monthName);
        }
      } catch (err) {
        console.error("Error fetching last upload:", err);
      }
    };
    fetchLastUpload();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadMessage("");
    setBelow75([]);
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadMessage("⚠️ Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setIsUploading(true);
      setProgress(0);
      setUploadMessage("");

      const res = await axios.post("https://attendence-separator.onrender.com/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percent);
        },
      });
      setUploadMessage("✅ File uploaded and processed successfully!");
      setProgress(100);
      if (res.data.uploadedAt) {
        const uploadedDate = new Date(res.data.uploadedAt);
        const formatted = uploadedDate.toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        });
        setLastUploadTime(formatted);
        const monthName = uploadedDate.toLocaleString("default", {
          month: "long",
        });
        setUploadMonth(monthName);
      }
      if (res.data.studentsBelow75) setBelow75(res.data.studentsBelow75);
    } catch (err) {
      console.error(err);
      setUploadMessage("❌ Upload failed! Try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const generateLetter = (student, month, department, yearSem) => {
    const doc = new jsPDF({ unit: "pt" });
    const left = 60;
    const top = 60;
    let y = top;
    const lineHeight = 18;
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.text(
      "DHANEKULA INSTITUTE OF ENGINEERING AND TECHNOLOGY",
      pageWidth / 2,
      y,
      { align: "center" }
    );
    y += lineHeight;

    doc.setFont("times", "normal");
    doc.setFontSize(12);
    doc.text("Ganguru, Vijayawada - 521 139", pageWidth / 2, y, {
      align: "center",
    });
    y += lineHeight * 2;

    doc.setFont("times", "bold");
    doc.text(`Department of ${department}`, pageWidth / 2, y, {
      align: "center",
    });
    y += lineHeight;

    doc.setFont("times", "italic");
    doc.text(`Year & Semester: ${yearSem}`, pageWidth / 2, y, {
      align: "center",
    });
    y += lineHeight * 2;

    doc.setFont("times", "normal");
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - left, y, {
      align: "right",
    });
    y += lineHeight * 2;

    doc.text("Dear Parent,", left, y);
    y += lineHeight * 2;

    const intro = `The following are the particulars about your ward ${student.name}, bearing Roll No: ${student.id}, studying in ${yearSem}, Department of ${department}.`;
    const introWrapped = doc.splitTextToSize(intro, pageWidth - 2 * left);
    doc.text(introWrapped, left, y);
    y += introWrapped.length * lineHeight + lineHeight;

    doc.text(
      `Attendance up to the end of ${month} is recorded as ${student.percentage}%.`,
      left,
      y
    );
    y += lineHeight * 2;

    const para1 =
      `The above attendance (up to ${month}) has already been sent to J.N.T. University. The remaining attendance will be posted as and when the month is over.`;
    const para1Wrapped = doc.splitTextToSize(para1, pageWidth - 2 * left);
    doc.text(para1Wrapped, left, y);
    y += para1Wrapped.length * lineHeight + lineHeight;

    const para2 =
      "As per the University regulations, the student has to maintain a minimum of 75% final attendance in each semester. Otherwise, he/she shall be detained and not allowed to write University examinations. This is for your kind information.";
    const para2Wrapped = doc.splitTextToSize(para2, pageWidth - 2 * left);
    doc.text(para2Wrapped, left, y);
    y += para2Wrapped.length * lineHeight + lineHeight;

    const note =
      "NOTE: Please return the letter with your signature. In case your ward does not have the required attendance and is failing subjects, you are urgently requested to come to the college and meet the HOD.";
    const noteWrapped = doc.splitTextToSize(note, pageWidth - 2 * left);
    doc.setFont("times", "bold");
    doc.text(noteWrapped, left, y);
    doc.setFont("times", "normal");
    y += noteWrapped.length * lineHeight + lineHeight * 2;

    const signY = y + lineHeight * 4;
    doc.text("Student Signature", left, signY);
    doc.text("Head of Department", pageWidth - left, signY, { align: "right" });

    const parentY = signY + lineHeight * 4;
    doc.text("Parent Name", left, parentY);
    doc.text("Parent Signature with Date", pageWidth - left, parentY, {
      align: "right",
    });

    doc.save(`${student.name}_attendance_letter.pdf`);
  };

  const generateAllLetters = () => {
    below75.forEach((student) =>
      generateLetter(student, uploadMonth, department, yearSem)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 relative">
      {/* Login success message */}
      {showLoginMessage && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg w-72 sm:w-80 rounded-3xl">
          <div className="mb-1">✅ You successfully logged in</div>
          <div className="w-full bg-green-700 h-1 rounded">
            <div
              className="bg-white h-1 rounded"
              style={{ width: `${loginProgress}%`, transition: "width 0.1s linear" }}
            ></div>
          </div>
        </div>
      )}

      {/* Welcome banner */}
      <div className="mt-10 relative overflow-hidden text-black w-full h-10 flex items-center bg-gradient-to-r from-sky-100 to-blue-200 rounded-md mb-6">
        <p className="absolute whitespace-nowrap px-4 animate-marquee font-medium text-gray-700 text-sm sm:text-base">
          🚀 Welcome {user ? `Mr.${user.name}` : "Guest"} — refresh page to view logout
        </p>
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            animation: marquee 15s linear infinite;
          }
        `}</style>
      </div>

      {/* Header */}
      <header className="bg-white shadow-lg rounded-xl p-4 sm:p-6 flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">
          Attendance Dashboard
        </h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="px-3 py-2 border rounded-lg shadow-sm w-full sm:w-auto"
          >
            <option value="Computer Science and Engineering">CSE</option>
            <option value="Information Technology">IT</option>
            <option value="Electronics and Communication Engineering">ECE</option>
            <option value="Mechanical Engineering">MECH</option>
            <option value="Civil Engineering">CIVIL</option>
          </select>

          <select
            value={yearSem}
            onChange={(e) => setYearSem(e.target.value)}
            className="px-3 py-2 border rounded-lg shadow-sm w-full sm:w-auto"
          >
            <option value="I - I">I - I</option>
            <option value="I - II">I - II</option>
            <option value="II - I">II - I</option>
            <option value="II - II">II - II</option>
            <option value="III - I">III - I</option>
            <option value="III - II">III - II</option>
            <option value="IV - I">IV - I</option>
            <option value="IV - II">IV - II</option>
          </select>

          <label className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer shadow-md transition-all duration-200 text-center">
            <input type="file" className="hidden" onChange={handleFileChange} />
            Upload Excel
          </label>

          <button
            onClick={handleUpload}
            disabled={isUploading}
            className={`px-4 py-2 rounded-lg text-white shadow-md transition-all duration-200 w-full sm:w-auto ${
              isUploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isUploading ? "Processing..." : "Submit"}
          </button>

          <div className="flex items-center space-x-2 text-gray-700 font-medium justify-center">
            <User className="w-6 h-6 text-blue-500" />
            <span>{user ? user.name : "Guest"}</span>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-green-500 to-green-700 text-white p-6 rounded-xl shadow-xl hover:scale-105 transform transition-all duration-300">
          <UploadCloud className="w-10 h-10 mb-3" />
          <p className="text-lg font-semibold mb-2">Last Upload</p>
          {isUploading && (
            <div className="w-full bg-white/30 rounded-full h-2 mt-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          {uploadMessage && <p className="mt-3 text-sm font-medium">{uploadMessage}</p>}
          {lastUploadTime ? (
            <p className="mt-1 text-xs italic flex items-center gap-1">⏰ {lastUploadTime}</p>
          ) : (
            <p className="mt-1 text-xs italic">No uploads yet</p>
          )}
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white p-6 rounded-xl shadow-xl hover:scale-105 transform transition-all duration-300">
          <User className="w-10 h-10 mb-3" />
          <p className="text-lg font-semibold mb-2">Logged in as</p>
          <p className="text-xl font-bold">{user ? `Mr.${user.name}` : "Guest"}</p>
        </div>
      </section>

      {/* Students */}
      {below75.length > 0 && (
        <section className="bg-white p-4 sm:p-6 rounded-xl shadow-xl mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-red-600">
              Students Below 75%
            </h2>
            <button
              onClick={generateAllLetters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full sm:w-auto"
            >
              Download All Letters
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-center text-sm sm:text-base">
              <thead className="bg-red-600 text-white">
                <tr>
                  <th className="py-2 px-2 sm:px-4">S.No</th>
                  <th className="py-2 px-2 sm:px-4">Roll No</th>
                  <th className="py-2 px-2 sm:px-4">Name</th>
                  <th className="py-2 px-2 sm:px-4">Total Attendance</th>
                  <th className="py-2 px-2 sm:px-4">% Attendance</th>
                  <th className="py-2 px-2 sm:px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {below75.map((s, i) => (
                  <tr
                    key={i}
                    className={`border-b hover:bg-gray-100 transition-all duration-200 ${
                      parseFloat(s.percentage) < 75 ? "bg-red-100" : ""
                    }`}
                  >
                    <td className="py-2 px-2 sm:px-4">{i + 1}</td>
                    <td className="py-2 px-2 sm:px-4">{s.id}</td>
                    <td className="py-2 px-2 sm:px-4">{s.name}</td>
                    <td className="py-2 px-2 sm:px-4">{s.marks}</td>
                    <td className="py-2 px-2 sm:px-4">{s.percentage}</td>
                    <td className="py-2 px-2 sm:px-4">
                      <button
                        onClick={() =>
                          generateLetter(s, uploadMonth, department, yearSem)
                        }
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-xs sm:text-sm"
                      >
                        Download Letter
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
