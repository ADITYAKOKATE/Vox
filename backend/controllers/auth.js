const User = require('../models/User');
const jwt = require('jsonwebtoken');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role
        });

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        console.log('🔹 Login Request:', { email, password }); // DEBUG

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Please provide an email and password' });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            console.log('❌ User not found'); // DEBUG
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        console.log('✅ User found:', user.email); // DEBUG
        console.log('🔐 Stored Hash:', user.password); // DEBUG

        // Check if password matches
        const isMatch = await user.matchPassword(password);
        console.log('❓ Password Match Result:', isMatch); // DEBUG

        if (!isMatch) {
            console.log('❌ Password mismatch'); // DEBUG
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        console.error('🔥 Login Error:', err); // DEBUG
        res.status(400).json({ success: false, error: err.message });
    }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d'
    });

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};
