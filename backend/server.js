const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Basic Route for Testing
app.get('/', (req, res) => {
  res.json({ message: 'Smart Civic Issue API is running...' });
});

// Route Files
const auth = require('./routes/auth');

const issues = require('./routes/issues');

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/issues', issues);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/civic-app');
    console.log('✅ MongoDB Connected');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Database connection error:', error);
  }
};

startServer();
