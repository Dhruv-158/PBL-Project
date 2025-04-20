const mongoose = require('mongoose');

const accessRequestSchema = new mongoose.Schema({
  complaintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint',
    required: true
  },
  supervisorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  resolvedAt: {
    type: Date
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Composite index to ensure uniqueness of pending requests
accessRequestSchema.index({ complaintId: 1, supervisorId: 1, status: 1 }, { 
  unique: true,
  partialFilterExpression: { status: 'pending' }
});

module.exports = mongoose.model('AccessRequest', accessRequestSchema);