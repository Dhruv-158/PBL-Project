const express = require('express');
const AccessRequestController = require('../controllers/accessrequestcontroller');
const AuthMiddleware = require('../middleware/authmiddleware');
const router = express.Router();

// Apply authentication middleware
router.use(AuthMiddleware.authenticate);

// Supervisor routes - requires supervisor role
router.use('/complaints/:complaintId/request-access', AuthMiddleware.requireSupervisor);
router.post('/complaints/:complaintId/request-access', AccessRequestController.createRequest);

router.use('/my-requests', AuthMiddleware.requireSupervisor);
router.get('/my-requests', AccessRequestController.getSupervisorRequests);

router.use('/complaints/:complaintId/student-details', AuthMiddleware.requireSupervisor);
router.get('/complaints/:complaintId/student-details', AccessRequestController.getStudentDetails);

// Admin routes - requires admin role
router.use('/pending', AuthMiddleware.requireAdmin);
router.get('/pending', AccessRequestController.getPendingRequests);

router.use('/:requestId/resolve', AuthMiddleware.requireAdmin);
router.patch('/:requestId/resolve', AccessRequestController.resolveRequest);

module.exports = router;