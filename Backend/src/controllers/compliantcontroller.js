const CompliantService = require('../services/compliantservice');

class CompliantController {
  async createCompliant(req, res, next) {
    try {
      const compliantData = {
        ...req.body,
        userId: req.user.userId
      };
      
      const compliant = await CompliantService.createCompliant(compliantData);
      res.status(201).json(compliant);
    } catch (error) {
      next(error);
    }
  }

  async getAllCompliants(req, res, next) {
    try {
      const { role, userId } = req.user;
      let filterOptions = {};
      
      // Regular users only see their own complaints
      if (role === 'user') {
        filterOptions.userId = userId;
      }
      
      const compliants = await CompliantService.getAllCompliants(filterOptions, role);
      res.status(200).json(compliants);
    } catch (error) {
      next(error);
    }
  }

  async getCompliantById(req, res, next) {
    try {
      const { role, userId } = req.user;
      
      if (role === 'admin') {
        // Admin gets full details
        const compliant = await CompliantService.getCompliantById(req.params.id);
        if (!compliant) {
          return res.status(404).json({ message: 'Complaint not found' });
        }
        return res.status(200).json(compliant);
      } else if (role === 'supervisor') {
        // Supervisor gets only complaintId and student name
        const compliant = await CompliantService.getCompliantForSupervisor(req.params.id);
        if (!compliant) {
          return res.status(404).json({ message: 'Complaint not found' });
        }
        return res.status(200).json(compliant);
      } else {
        // Regular user can only access their own complaints
        const compliant = await CompliantService.getCompliantById(req.params.id);
        if (!compliant) {
          return res.status(404).json({ message: 'Complaint not found' });
        }
        
        if (compliant.userId.toString() !== userId) {
          return res.status(403).json({ message: 'Not authorized to view this complaint' });
        }
        
        return res.status(200).json(compliant);
      }
    } catch (error) {
      next(error);
    }
  }

  async getCompliantByUniqueId(req, res, next) {
    try {
      const { role, userId } = req.user;
      const compliant = await CompliantService.getCompliantByUniqueId(req.params.uniqueId);
      
      if (!compliant) {
        return res.status(404).json({ message: 'Complaint not found' });
      }
      
      if (role === 'admin') {
        // Admin gets full details
        return res.status(200).json(compliant);
      } else if (role === 'supervisor') {
        // Supervisor gets only complaintId and student name
        return res.status(200).json({
          uniqueId: compliant.uniqueId,
          studentName: compliant.userId ? (await User.findById(compliant.userId)).name : 'Unknown',
          status: compliant.status,
          priority: compliant.priority,
          createdAt: compliant.createdAt,
          updatedAt: compliant.updatedAt
        });
      } else if (compliant.userId.toString() !== userId) {
        // Regular user can only access their own complaints
        return res.status(403).json({ message: 'Not authorized to view this complaint' });
      }
      
      res.status(200).json(compliant);
    } catch (error) {
      next(error);
    }
  }

  async updateCompliant(req, res, next) {
    try {
      const compliant = await CompliantService.getCompliantById(req.params.id);
      
      if (!compliant) {
        return res.status(404).json({ message: 'Complaint not found' });
      }
      
      const { role, userId } = req.user;
      
      // Check permissions based on role
      if (role === 'user' && compliant.userId.toString() !== userId) {
        return res.status(403).json({ message: 'Not authorized to update this complaint' });
      }
      
      // For supervisors, only allow updating status and priority
      if (role === 'supervisor') {
        const allowedFields = ['status', 'priority'];
        const updateData = {};
        allowedFields.forEach(field => {
          if (req.body[field]) updateData[field] = req.body[field];
        });
        
        const updatedCompliant = await CompliantService.updateCompliant(req.params.id, updateData);
        return res.status(200).json({
          uniqueId: updatedCompliant.uniqueId,
          status: updatedCompliant.status,
          priority: updatedCompliant.priority,
          updatedAt: updatedCompliant.updatedAt
        });
      }
      
      // For admins and complaint owners
      const updatedCompliant = await CompliantService.updateCompliant(req.params.id, req.body);
      res.status(200).json(updatedCompliant);
    } catch (error) {
      next(error);
    }
  }

  async assignCompliant(req, res, next) {
    try {
      // Only admins can assign complaints to supervisors
      const { id } = req.params;
      const { supervisorId } = req.body;
      
      const compliant = await CompliantService.getCompliantById(id);
      if (!compliant) {
        return res.status(404).json({ message: 'Complaint not found' });
      }
      
      const updatedCompliant = await CompliantService.assignCompliant(id, supervisorId);
      res.status(200).json(updatedCompliant);
    } catch (error) {
      next(error);
    }
  }

  async addComment(req, res, next) {
    try {
      const { id } = req.params;
      const { text } = req.body;
      
      const compliant = await CompliantService.getCompliantById(id);
      if (!compliant) {
        return res.status(404).json({ message: 'Complaint not found' });
      }
      
      // Check if user is allowed to comment
      const { role, userId } = req.user;
      if (role === 'user' && compliant.userId.toString() !== userId) {
        return res.status(403).json({ message: 'Not authorized to comment on this complaint' });
      }
      
      const commentData = {
        text,
        author: userId
      };
      
      const updatedCompliant = await CompliantService.addComment(id, commentData);
      
      // Filter response based on role
      if (role === 'supervisor') {
        return res.status(200).json({
          uniqueId: updatedCompliant.uniqueId,
          status: updatedCompliant.status,
          message: 'Comment added successfully'
        });
      }
      
      res.status(200).json(updatedCompliant);
    } catch (error) {
      next(error);
    }
  }

  async deleteCompliant(req, res, next) {
    try {
      const compliant = await CompliantService.getCompliantById(req.params.id);
      
      if (!compliant) {
        return res.status(404).json({ message: 'Complaint not found' });
      }
      
      // Only admins or the user who created the complaint can delete it
      const { role, userId } = req.user;
      if (role !== 'admin' && compliant.userId.toString() !== userId) {
        return res.status(403).json({ message: 'Not authorized to delete this complaint' });
      }
      
      await CompliantService.deleteCompliant(req.params.id);
      res.status(200).json({ message: 'Complaint deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CompliantController();