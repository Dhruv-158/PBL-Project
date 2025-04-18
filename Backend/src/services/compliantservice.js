// src/services/compliantservice.js
const Compliant = require('../models/compliantmodel');
const User = require('../models/User');

class CompliantService {
  async createCompliant(compliantData) {
    try {
      // Create a new instance of the Compliant model
      const compliant = new Compliant(compliantData);
      
      // Generate the uniqueId if it's not provided
      if (!compliant.uniqueId) {
        const date = new Date();
        const year = date.getFullYear().toString().substr(-2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        // Find the count of documents created today
        const count = await Compliant.countDocuments({
          createdAt: {
            $gte: new Date(date.setHours(0, 0, 0, 0)),
            $lt: new Date(date.setHours(23, 59, 59, 999))
          }
        });
        
        // Format: CMP-YYMMDD-XXXX (where XXXX is a sequential number)
        compliant.uniqueId = `CMP-${year}${month}${day}-${String(count + 1).padStart(4, '0')}`;
      }
      
      // Save the document
      return await compliant.save();
    } catch (error) {
      console.error('Error creating complaint:', error);
      throw error;
    }
  }

  async getAllCompliantsByUser(userId) {
    return await Compliant.find({ userId });
  }

  async getCompliantById(id) {
    return await Compliant.findById(id);
  }

  async getCompliantByUniqueId(uniqueId) {
    return await Compliant.findOne({ uniqueId });
  }

  async getAllCompliants(filterOptions = {}, userRole = 'user') {
    if (userRole === 'admin') {
      // Admin gets full complaint data with user info
      return await Compliant.find(filterOptions)
        .sort({ createdAt: -1 })
        .populate('userId', 'username email name studentId enrollmentId college department')
        .populate('assignedTo', 'username email name supervisorId department');
    } else if (userRole === 'supervisor') {
      // For supervisors - return only limited fields (complaintId and student name)
      const complaints = await Compliant.find(filterOptions)
        .sort({ createdAt: -1 })
        .populate('userId', 'name'); // Only populate the name field
      
      // Format the response to only include uniqueId and student name
      return complaints.map(complaint => ({
        _id: complaint._id,
        uniqueId: complaint.uniqueId,
        studentName: complaint.userId ? complaint.userId.name : 'Unknown',
        status: complaint.status,
        priority: complaint.priority,
        createdAt: complaint.createdAt,
        updatedAt: complaint.updatedAt
      }));
    } else {
      // Regular users only get their own complaints
      return await Compliant.find(filterOptions)
        .sort({ createdAt: -1 });
    }
  }

  async getCompliantForSupervisor(compliantId) {
    const complaint = await Compliant.findById(compliantId)
      .populate('userId', 'name');
    
    if (!complaint) return null;
    
    // Return only the permitted fields for supervisor
    return {
      _id: complaint._id,
      uniqueId: complaint.uniqueId,
      studentName: complaint.userId ? complaint.userId.name : 'Unknown',
      status: complaint.status,
      priority: complaint.priority,
      createdAt: complaint.createdAt,
      updatedAt: complaint.updatedAt
    };
  }

  async updateCompliant(id, updateData) {
    return await Compliant.findByIdAndUpdate(
      id, 
      { ...updateData, updatedAt: Date.now() },
      { new: true }
    );
  }

  async assignCompliant(id, supervisorId) {
    // Check if supervisor exists and has the right role
    const supervisor = await User.findById(supervisorId);
    if (!supervisor || supervisor.role !== 'supervisor') {
      throw new Error('Invalid supervisor assignment');
    }

    return await Compliant.findByIdAndUpdate(
      id,
      { 
        assignedTo: supervisorId,
        status: 'in-review',
        updatedAt: Date.now()
      },
      { new: true }
    );
  }

  async addComment(id, commentData) {
    return await Compliant.findByIdAndUpdate(
      id,
      { 
        $push: { comments: commentData },
        updatedAt: Date.now()
      },
      { new: true }
    );
  }

  async deleteCompliant(id) {
    return await Compliant.findByIdAndDelete(id);
  }
}

module.exports = new CompliantService();