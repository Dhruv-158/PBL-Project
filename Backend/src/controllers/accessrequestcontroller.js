class AccessRequestController {
  async createRequest(req, res, next) {
    try {
      const { complaintId } = req.params;
      const { reason } = req.body;
      const supervisorId = req.user.userId;

      if (req.user.role !== 'supervisor') {
        return res.status(403).json({ message: 'Only supervisors can request student details' });
      }

      const result = await AccessRequestService.createRequest(complaintId, supervisorId, reason);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getPendingRequests(req, res, next) {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const requests = await AccessRequestService.getPendingRequests();
      res.status(200).json(requests);
    } catch (error) {
      next(error);
    }
  }

  async resolveRequest(req, res, next) {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }

      const { requestId } = req.params;
      const { status } = req.body;
      const adminId = req.user.userId;

      const result = await AccessRequestService.resolveRequest(requestId, status, adminId);
      res.status(200).json({
        message: `Request ${status}`,
        request: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getSupervisorRequests(req, res, next) {
    try {
      if (req.user.role !== 'supervisor') {
        return res.status(403).json({ message: 'Supervisor access required' });
      }

      const supervisorId = req.user.userId;
      const requests = await AccessRequestService.getSupervisorRequests(supervisorId);
      res.status(200).json(requests);
    } catch (error) {
      next(error);
    }
  }

  async getStudentDetails(req, res, next) {
    try {
      if (req.user.role !== 'supervisor') {
        return res.status(403).json({ message: 'Supervisor access required' });
      }

      const { complaintId } = req.params;
      const supervisorId = req.user.userId;

      const result = await AccessRequestService.getCompleteStudentInfo(complaintId, supervisorId);
      res.status(200).json(result);
    } catch (error) {
      if (error.message === 'You do not have permission to view complete student information') {
        return res.status(403).json({ 
          message: error.message,
          requestRequired: true
        });
      }
      next(error);
    }
  }
}

module.exports = new AccessRequestController();