// server/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const sessionMiddleware = require('../middleware/sessionMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const { loginValidation, registerValidation, validate } = require('../middleware/validationMiddleware');

router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);
router.get('/profile', sessionMiddleware, authController.getProfile);

// Admin routes
router.get('/users', sessionMiddleware, adminMiddleware, authController.getAllUsers);
router.put('/users/:userId/toggle-admin', sessionMiddleware, adminMiddleware, authController.toggleUserAdmin);

module.exports = router;
