const Issue = require('../models/Issue');

// @desc    Get all issues (for public/map or admin)
// @route   GET /api/v1/issues
// @access  Public
exports.getAllIssues = async (req, res, next) => {
    try {
        const issues = await Issue.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: issues.length,
            data: issues
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Get single issue
// @route   GET /api/v1/issues/:id
// @access  Public
exports.getIssue = async (req, res, next) => {
    try {
        const issue = await Issue.findById(req.params.id).populate('user', 'name');

        if (!issue) {
            return res.status(404).json({
                success: false,
                error: 'Issue not found'
            });
        }

        res.status(200).json({
            success: true,
            data: issue
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Create new issue
// @route   POST /api/v1/issues
// @access  Private
exports.createIssue = async (req, res, next) => {
    try {
        console.log("Create Issue Request Body:", req.body);
        console.log("Create Issue Request File:", req.file);

        const { title, description, type, location } = req.body;

        // "location" might come as a stringified JSON if sent via FormData
        let parsedLocation = location;
        if (typeof location === 'string') {
            try {
                parsedLocation = JSON.parse(location);
            } catch (e) {
                console.error("Error parsing location JSON:", e);
            }
        }

        const issue = await Issue.create({
            title,
            description,
            type,
            location: parsedLocation,
            image: req.file ? req.file.path : 'https://via.placeholder.com/300', // Use Cloudinary URL
            user: req.user.id
        });

        res.status(201).json({
            success: true,
            data: issue
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get current user's issues
// @route   GET /api/v1/issues/my-issues
// @access  Private
exports.getMyIssues = async (req, res, next) => {
    try {
        const issues = await Issue.find({ user: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: issues.length,
            data: issues
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Get stats
// @route   GET /api/v1/issues/stats
// @access  Private
exports.getIssueStats = async (req, res, next) => {
    try {
        const total = await Issue.countDocuments({ user: req.user.id });
        const resolved = await Issue.countDocuments({ user: req.user.id, status: 'Resolved' });
        const pending = await Issue.countDocuments({ user: req.user.id, status: 'Pending' });

        res.status(200).json({
            success: true,
            data: {
                total,
                resolved,
                pending
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};
