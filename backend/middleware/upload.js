const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'civic_app_issues', // Folder name in Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'mp4', 'mov', 'avi'],
        resource_type: 'auto', // Auto-detect image or video
    },
});

const upload = multer({ storage: storage });

module.exports = upload;
