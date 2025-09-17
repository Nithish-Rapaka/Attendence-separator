const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./Routes/routes');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/users', userRoutes);

let lastUpload = null;

// Multer storage config
const ds = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: ds });

const rollRegex = /^[0-9]{3}[A-Za-z0-9]{7}$/;

app.post('/upload', upload.single('avatar'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    lastUpload = new Date();
    const filePath = path.join(__dirname, 'uploads', req.file.filename);

    try {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

       
        const normalizedData = data.map(student => ({
            id: student.__EMPTY || student.ID || student.Roll || "",
            name: student.__EMPTY_1 || student.Name || "",
            marks: student.__EMPTY_2 || student.Marks || 0,
            percentage: student.__EMPTY_3 || student.Percentage || 0
        }));

        
        const below75 = normalizedData.filter(s =>
            rollRegex.test(s.id.trim()) &&
            !isNaN(parseFloat(s.percentage)) &&
            parseFloat(s.percentage) < 75
        );

        // Auto delete uploaded file after processing
        setTimeout(() => {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error("Error deleting file:", err);
                }
            });
        }, 300);

        res.json({
            message: "File processed successfully.",
            uploadedAt: lastUpload,
            studentsBelow75: below75
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error processing file", error });
    }
});

app.get('/last-upload', (req, res) => {
    res.json({ uploadedAt: lastUpload });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
