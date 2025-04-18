const express = require('express');
const AccessRequestController = require('../controllers/accessrequestcontroller');
const AuthMiddleware = require('../middleware/authmiddleware');
const router = express.Router();

// Apply authentication middleware
router.use(AuthMiddleware.authenticate);

// Supervisor routes
router.post('/complaints/:complaintId/request-access', AccessRequestController.createRequest);
router.get('/my-requests', AccessRequestController.getSupervisorRequests);
router.get('/complaints/:complaintId/student-details', AccessRequestController.getStudentDetails);

// Admin routes
router.get('/pending', AccessRequestController.getPendingRequests);
router.patch('/:requestId/resolve', AccessRequestController.resolveRequest);

module.exports = router;