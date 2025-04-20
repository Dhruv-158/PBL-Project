const ComplaintService = require('../services/compliantservice');
const User = require('../models/User');

class ComplaintController {
  async createComplaint(req, res, next) {
    try {
      const complaintData = {
        ...req.body,
        userId: req.user.userId
      };
      
      const complaint = await ComplaintService.createComplaint(complaintData);
      res.status(201).json(complaint);
    } catch (error) {
      next(error);
    }
  }

  async getAllComplaints(req, res, next) {
    try {
      const { role, userId } = req.user;
      let filterOptions = {};
      
      // Regular users only see their own complaints
      if (role === 'user') {
        filterOptions.userId = userId;
      }
      
      const complaints = await ComplaintService.getAllComplaints(filterOptions, role);
      res.status(200).json(complaints);
    } catch (error) {
      next(error);
    }
  }

  async getComplaintById(req, res, next) {
    try {
      const { role, userId } = req.user;
      
      if (role === 'admin') {
        // Admin gets full details
        const complaint = await ComplaintService.getComplaintById(req.params.id);
        if (!complaint) {
          return res.status(404).json({ message: 'Complaint not found' });
        }
        return res.status(200).json(complaint);
      } else if (role === 'supervisor') {
        // Supervisor gets only uniqueId and student name
        const complaint = await ComplaintService.getComplaintForSupervisor(req.params.id);
        if (!complaint) {
          return res.status(404).json({ message: 'Complaint not found' });
        }
        return res.status(200).json(complaint);
      } else {
        // Regular user can only access their own complaints
        const complaint = await ComplaintService.getComplaintById(req.params.id);
        if (!complaint) {
          return res.status(404).json({ message: 'Complaint not found' });
        }
        
        if (complaint.userId.toString() !== userId) {
          return res.status(403).json({ message: 'Not authorized to view this complaint' });
        }
        
        return res.status(200).json(complaint);
      }
    } catch (error) {
      next(error);
    }
  }

  async getComplaintByUniqueId(req, res, next) {
    try {
      const { role, userId } = req.user;
      const complaint = await ComplaintService.getComplaintByUniqueId(req.params.uniqueId);
      
      if (!complaint) {
        return res.status(404).json({ message: 'Complaint not found' });
      }
      
      if (role === 'admin') {
        // Admin gets full details
        return res.status(200).json(complaint);
      } else if (role === 'supervisor') {
        // Supervisor gets only uniqueId and student name
        const user = complaint.userId ? await User.findById(complaint.userId) : null;
        return res.status(200).json({
          uniqueId: complaint.uniqueId,
          studentName: user ? user.name : 'Unknown',
          status: complaint.status,
          priority: complaint.priority,
          createdAt: complaint.createdAt,
          updatedAt: complaint.updatedAt
        });
      } else if (complaint.userId.toString() !== userId) {
        // Regular user can only access their own complaints
        return res.status(403).json({ message: 'Not authorized to view this complaint' });
      }
      
      res.status(200).json(complaint);
    } catch (error) {
      next(error);
    }
  }

  async updateComplaint(req, res, next) {
    try {
      const complaint = await ComplaintService.getComplaintById(req.params.id);
      
      if (!complaint) {
        return res.status(404).json({ message: 'Complaint not found' });
      }
      
      const { role, userId } = req.user;
      
      // Check permissions based on role
      if (role === 'user' && complaint.userId.toString() !== userId) {
        return res.status(403).json({ message: 'Not authorized to update this complaint' });
      }
      
      // For supervisors, only allow updating status and priority
      if (role === 'supervisor') {
        const allowedFields = ['status', 'priority'];
        const updateData = {};
        allowedFields.forEach(field => {
          if (req.body[field]) updateData[field] = req.body[field];
        });
        
        const updatedComplaint = await ComplaintService.updateComplaint(req.params.id, updateData);
        return res.status(200).json({
          uniqueId: updatedComplaint.uniqueId,
          status: updatedComplaint.status,
          priority: updatedComplaint.priority,
          updatedAt: updatedComplaint.updatedAt
        });
      }
      
      // For admins and complaint owners
      const updatedComplaint = await ComplaintService.updateComplaint(req.params.id, req.body);
      res.status(200).json(updatedComplaint);
    } catch (error) {
      next(error);
    }
  }

  async assignComplaint(req, res, next) {
    try {
      // Only admins can assign complaints to supervisors
      const { id } = req.params;
      const { supervisorId } = req.body;
      
      const complaint = await ComplaintService.getComplaintById(id);
      if (!complaint) {
        return res.status(404).json({ message: 'Complaint not found' });
      }
      
      const updatedComplaint = await ComplaintService.assignComplaint(id, supervisorId);
      res.status(200).json(updatedComplaint);
    } catch (error) {
      next(error);
    }
  }

  async addComment(req, res, next) {
    try {
      const { id } = req.params;
      const { text } = req.body;
      
      const complaint = await ComplaintService.getComplaintById(id);
      if (!complaint) {
        return res.status(404).json({ message: 'Complaint not found' });
      }
      
      // Check if user is allowed to comment
      const { role, userId } = req.user;
      if (role === 'user' && complaint.userId.toString() !== userId) {
        return res.status(403).json({ message: 'Not authorized to comment on this complaint' });
      }
      
      const commentData = {
        text,
        author: userId
      };
      
      const updatedComplaint = await ComplaintService.addComment(id, commentData);
      
      // Filter response based on role
      if (role === 'supervisor') {
        return res.status(200).json({
          uniqueId: updatedComplaint.uniqueId,
          status: updatedComplaint.status,
          message: 'Comment added successfully'
        });
      }
      
      res.status(200).json(updatedComplaint);
    } catch (error) {
      next(error);
    }
  }

  async deleteComplaint(req, res, next) {
    try {
      const complaint = await ComplaintService.getComplaintById(req.params.id);
      
      if (!complaint) {
        return res.status(404).json({ message: 'Complaint not found' });
      }
      
      // Only admins or the user who created the complaint can delete it
      const { role, userId } = req.user;
      if (role !== 'admin' && complaint.userId.toString() !== userId) {
        return res.status(403).json({ message: 'Not authorized to delete this complaint' });
      }
      
      await ComplaintService.deleteComplaint(req.params.id);
      res.status(200).json({ message: 'Complaint deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ComplaintController();