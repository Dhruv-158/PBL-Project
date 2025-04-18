const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./src/routes/authroutes');
const compliantRoutes = require('./src/routes/compliantroutes');
const accessRequestRoutes = require('./src/routes/accessrequestroutes');

// Initialize Express
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/complaint_db')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

// Routes
app.get('/', (req, res) => {
  res.send('API is running');
});
app.use('/api/auth', authRoutes);
app.use('/api/complaints', compliantRoutes);
app.use('/api/access-requests', accessRequestRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});