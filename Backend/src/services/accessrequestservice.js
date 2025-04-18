const AccessRequest = require('../models/accessrequestmodel');
const CompliantService = require('./compliantservice');
const User = require('../models/User');

class AccessRequestService {
  async createRequest(complaintId, supervisorId, reason) {
    // Check if there's already a pending request
    const existingRequest = await AccessRequest.findOne({
      complaintId,
      supervisorId,
      status: 'pending'
    });

    if (existingRequest) {
      return {
        message: 'A request is already pending for this complaint',
        request: existingRequest
      };
    }

    // Create a new request
    const request = new AccessRequest({
      complaintId,
      supervisorId,
      reason
    });

    await request.save();
    return {
      message: 'Access request submitted successfully',
      request
    };
  }

  async getPendingRequests() {
    return await AccessRequest.find({ status: 'pending' })
      .populate('complaintId', 'uniqueId title')
      .populate('supervisorId', 'name supervisorId department');
  }

  async getRequestById(requestId) {
    return await AccessRequest.findById(requestId)
      .populate('complaintId', 'uniqueId title')
      .populate('supervisorId', 'name supervisorId department');
  }

  async resolveRequest(requestId, status, adminId) {
    if (!['approved', 'rejected'].includes(status)) {
      throw new Error('Invalid status. Must be approved or rejected.');
    }

    const request = await AccessRequest.findByIdAndUpdate(
      requestId,
      {
        status,
        resolvedAt: Date.now(),
        resolvedBy: adminId
      },
      { new: true }
    );

    if (!request) {
      throw new Error('Request not found');
    }

    return request;
  }

  async getSupervisorRequests(supervisorId) {
    return await AccessRequest.find({ supervisorId })
      .populate('complaintId', 'uniqueId title')
      .sort({ requestedAt: -1 });
  }

  async hasApprovedAccess(complaintId, supervisorId) {
    const approvedRequest = await AccessRequest.findOne({
      complaintId,
      supervisorId,
      status: 'approved'
    });

    return !!approvedRequest;
  }

  async getCompleteStudentInfo(complaintId, supervisorId) {
    // Check if supervisor has approved access
    const hasAccess = await this.hasApprovedAccess(complaintId, supervisorId);
    
    if (!hasAccess) {
      throw new Error('You do not have permission to view complete student information');
    }

    // Get the complaint with full student details
    const complaint = await CompliantService.getCompliantById(complaintId);
    
    if (!complaint) {
      throw new Error('Complaint not found');
    }

    // Get detailed student information
    const studentDetails = await User.findById(complaint.userId, {
      password: 0 // Exclude password
    });

    if (!studentDetails) {
      throw new Error('Student information not found');
    }

    return {
      complaint,
      studentDetails
    };
  }
}

module.exports = new AccessRequestService();