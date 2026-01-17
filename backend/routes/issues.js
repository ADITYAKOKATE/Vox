const express = require('express');
const {
    getAllIssues,
    getIssue,
    createIssue,
    getMyIssues,
    getIssueStats
} = require('../controllers/issueController');

const router = express.Router();

const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes (or protected depending on requirements, kept public for map view)
router.route('/')
    .get(getAllIssues)
    .post(protect, (req, res, next) => {
        console.log('Issues POST content-type:', req.headers['content-type']);
        next();
    }, upload.single('image'), createIssue);

// Specific user routes
router.route('/my-issues').get(protect, getMyIssues);
router.route('/stats').get(protect, getIssueStats);

// Single issue routes
router.route('/:id').get(getIssue);

module.exports = router;
