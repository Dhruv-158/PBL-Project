const express = require('express');
const CompliantController = require('../controllers/compliantcontroller');
const AuthMiddleware = require('../middleware/authmiddleware');
const router = express.Router();

// Apply authentication middleware to all complaint routes
router.use(AuthMiddleware.authenticate);

// Routes accessible by all authenticated users
router.post('/', CompliantController.createCompliant);
router.get('/', CompliantController.getAllCompliants);
router.get('/:id', CompliantController.getCompliantById);
router.get('/unique/:uniqueId', CompliantController.getCompliantByUniqueId);

// Routes with role-based access control
router.put('/:id', CompliantController.updateCompliant);
router.post('/:id/comments', CompliantController.addComment);
router.delete('/:id', CompliantController.deleteCompliant);

// Admin-only routes
router.use(AuthMiddleware.requireAdmin);
router.patch('/:id/assign', CompliantController.assignCompliant);

module.exports = router;