const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'supervisor'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Complaint ID for users to send complaints
  complaintId: {
    type: String,
    unique: true,
    sparse: true // Only enforce uniqueness if the field exists
  },
  // Fields for users
  studentId: {
    type: String,
    required: function () { return this.role === 'user'; }
  },
  name: {
    type: String,
    required: function () { return this.role === 'user' || this.role === 'supervisor'; }
  },
  enrollmentId: {
    type: String,
    required: function () { return this.role === 'user'; }
  },
  college: {
    type: String,
    required: function () { return this.role === 'user'; }
  },
  department: {
    type: String,
    required: function () { return this.role === 'user' || this.role === 'supervisor'; }
  },
  supervisorId: {
    type: String,
    required: function () { return this.role === 'supervisor'; }
  }
});

// Password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema, 'users');