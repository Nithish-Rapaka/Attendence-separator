const User = require('../models/User')
const bcrypt = require('bcryptjs')
const generateToken = require('../utils/generateToken')


const registerUser = async (req, res) => {
    const { name, id, password } = req.body;
    try {
        const exist = await User.findOne({ id });
        if (exist) return res.status(400).json({ message: 'UserId already Exists' });

        const hashedpassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name, id, password: hashedpassword
        });
        res.status(201).json({
            _id: user._id,
            name: user.name,
            id: user.id,
            token: generateToken(user._id)
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const loginUser = async (req, res) => {
    const { id, password } = req.body;
    try {
        const user = await User.findOne({ id });
        if (!user) return res.status(404).json({ message: "User not found" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Enter a valid passsword" });
        res.status(200).json({
            _id: user._id,
            name: user.name,
            id: user.id,
            token: generateToken(user._id)
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    registerUser,
    loginUser
};

