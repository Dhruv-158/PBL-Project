const Complaint = require('../models/compliantmodel');
const User = require('../models/User');

class ComplaintService {
  async createComplaint(complaintData) {
    try {
      // Create a new instance of the Complaint model
      const complaint = new Complaint(complaintData);
      
      // Generate the uniqueId if it's not provided
      if (!complaint.uniqueId) {
        const date = new Date();
        const year = date.getFullYear().toString().substr(-2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        // Find the count of documents created today
        const count = await Complaint.countDocuments({
          createdAt: {
            $gte: new Date(date.setHours(0, 0, 0, 0)),
            $lt: new Date(date.setHours(23, 59, 59, 999))
          }
        });
        
        // Format: CMP-YYMMDD-XXXX (where XXXX is a sequential number)
        complaint.uniqueId = `CMP-${year}${month}${day}-${String(count + 1).padStart(4, '0')}`;
      }
      
      // Save the document
      return await complaint.save();
    } catch (error) {
      console.error('Error creating complaint:', error);
      throw error;
    }
  }

  async getAllComplaintsByUser(userId) {
    return await Complaint.find({ userId });
  }

  async getComplaintById(id) {
    return await Complaint.findById(id);
  }

  async getComplaintByUniqueId(uniqueId) {
    return await Complaint.findOne({ uniqueId });
  }

  async getAllComplaints(filterOptions = {}, userRole = 'user') {
    if (userRole === 'admin') {
      // Admin gets full complaint data with user info
      return await Complaint.find(filterOptions)
        .sort({ createdAt: -1 })
        .populate('userId', 'username email name studentId enrollmentId college department')
        .populate('assignedTo', 'username email name supervisorId department');
    } else if (userRole === 'supervisor') {
      // For supervisors - return only limited fields (uniqueId and student name)
      const complaints = await Complaint.find(filterOptions)
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
      return await Complaint.find(filterOptions)
        .sort({ createdAt: -1 });
    }
  }

  async getComplaintForSupervisor(complaintId) {
    const complaint = await Complaint.findById(complaintId)
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

  async updateComplaint(id, updateData) {
    return await Complaint.findByIdAndUpdate(
      id, 
      { ...updateData, updatedAt: Date.now() },
      { new: true }
    );
  }

  async assignComplaint(id, supervisorId) {
    // Check if supervisor exists and has the right role
    const supervisor = await User.findById(supervisorId);
    if (!supervisor || supervisor.role !== 'supervisor') {
      throw new Error('Invalid supervisor assignment');
    }

    return await Complaint.findByIdAndUpdate(
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
    return await Complaint.findByIdAndUpdate(
      id,
      { 
        $push: { comments: commentData },
        updatedAt: Date.now()
      },
      { new: true }
    );
  }

  async deleteComplaint(id) {
    return await Complaint.findByIdAndDelete(id);
  }
}

module.exports = new ComplaintService();