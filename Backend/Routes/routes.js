const express = require('express');
const multer = require('multer');
const path = require('path');
const XLSX = require('xlsx');
const { registerUser, loginUser } = require('../controllers/datacontroller');
const { validateLogin, validateRegister } = require('../Middlewares/validateMiddleware');
const protect = require('../Middlewares/authMiddleWare');
const User = require('../models/User');

const router = express.Router();

// ---------- Existing Auth Routes ----------
router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);

router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/profile', protect, (req, res) => {
  res.json({ message: `Welcome, ${req.user.name}` });
});

// ---------- New Excel Upload Route ----------
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/process-excel', protect, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(sheet);

    // Filter students below 75%
    const below75 = data.filter(student => parseFloat(student['Per (100%)']) < 75);

    res.json({ below75 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error processing file' });
  }
});

module.exports = router;
