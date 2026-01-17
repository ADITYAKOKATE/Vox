const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title for the issue'],
        trim: true,
        maxlength: [50, 'Title cannot be more than 50 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    type: {
        type: String,
        required: [true, 'Please select an issue type'],
        enum: [
            'Pothole',
            'Streetlight',
            'Garbage',
            'Water',
            'Noise',
            'Traffic',
            'Other'
        ]
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
        default: 'Pending'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    image: {
        type: String,
        default: 'no-photo.jpg'
    },
    location: {
        address: {
            type: String
        },
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Issue', IssueSchema);
