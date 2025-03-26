const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo:27017/cyberworkshop', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define Student Schema
const StudentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  college: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String
  },
  browser: {
    type: String
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
});

// Create Student model
const Student = mongoose.model('Student', StudentSchema);

// Routes
// Home route - Serve HTML registration page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Admin route - View registrations
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

// API route - Get all students
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register student
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, college, email, phone } = req.body;
    
    // Create new student
    const student = new Student({
      username,
      password,
      college,
      email,
      phone,
      ipAddress: req.ip || req.connection.remoteAddress,
      browser: req.headers['user-agent']
    });
    
    await student.save();
    
    res.status(201).json({ success: true, message: 'Registration successful!' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: 'Registration failed' });
  }
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});