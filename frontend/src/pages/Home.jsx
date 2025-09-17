import {Link} from 'react-router-dom'
export default function Home() {
    return (
        <div className="min-h-screen bg-white text-gray-800">
           
            <section
                className="relative flex flex-col items-center justify-center text-center py-28 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white overflow-hidden"
                data-aos="fade-up"
                data-os-delay='0'
            >
              
                <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight relative z-10">
                    Automate Attendance Letters <br />
                    <span className="text-yellow-300">Instantly</span>
                </h1>
                <p
                    className="text-lg md:text-xl max-w-2xl mb-10 opacity-90 leading-relaxed relative z-10"
                    data-aos="fade-up"
                    data-aos-delay="200"
                >
                    This platform is specifically built for faculty members to upload student attendance sheets and generate automated
                     warning letters for students with less than 75% attendance.

                </p>
              <Link to="/dashboard"><button
                    className="relative z-10 px-6 py-3 bg-sky-500 text-gray-900 font-semibold rounded-lg shadow-md hover:bg-yellow-400 transition-colors cursor-pointer"
                    data-aos="zoom-in"
                    data-aos-delay="400"
                >
                    Get Started 🚀

                </button></Link>
            </section>
            <section className="py-20 px-8 max-w-7xl mx-auto grid md:grid-cols-3 gap-10 cursor-pointer">
                {[
                    {
                        icon: "📂",
                        title: "Upload Files",
                        text: "Faculty can securely upload Excel or PDF attendance sheets.",
                        delay: 0,
                    },
                    {
                        icon: "⚡",
                        title: "Auto Detection",
                        text: "System identifies students with less than 75% attendance instantly.",
                        delay: 200,
                    },
                    {
                        icon: "📝",
                        title: "Generate Letters",
                        text: "Download ready-to-print PDF letters within seconds.",
                        delay: 400,
                    },
                ].map((item, index) => (
                    <div
                        key={index}
                        className="p-8 bg-white shadow-150-lg rounded-2xl hover:shadow-2xl hover:scale-105 border hover:border-blue-500 transition transform"
                        data-aos="zoom-in"
                        data-aos-delay={item.delay}
                    >
                        <div className="text-4xl mb-4">{item.icon}</div>
                        <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                        <p className="text-gray-600">{item.text}</p>
                    </div>
                ))}
            </section>
        </div>
    );
}
