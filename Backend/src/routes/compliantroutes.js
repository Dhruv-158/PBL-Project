const express = require('express');
const ComplaintController = require('../controllers/compliantcontroller');
const AuthMiddleware = require('../middleware/authmiddleware');
const router = express.Router();

// Apply authentication middleware to all complaint routes
router.use(AuthMiddleware.authenticate);

// Routes accessible by all authenticated users
router.post('/', ComplaintController.createComplaint);
router.get('/', ComplaintController.getAllComplaints);
router.get('/:id', ComplaintController.getComplaintById);
router.get('/unique/:uniqueId', ComplaintController.getComplaintByUniqueId);

// Routes with role-based access control
router.put('/:id', ComplaintController.updateComplaint);
router.post('/:id/comments', ComplaintController.addComment);
router.delete('/:id', ComplaintController.deleteComplaint);

// Admin-only routes
router.use(AuthMiddleware.requireAdmin);
router.patch('/:id/assign', ComplaintController.assignComplaint);

module.exports = router;