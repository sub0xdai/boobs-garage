// server/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const sessionMiddleware = require('../middleware/sessionMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const { loginValidation, registerValidation, validate } = require('../middleware/validationMiddleware');

// Change login route to use loginWithTokens instead of login
router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.loginWithTokens); 
router.get('/profile', sessionMiddleware, authController.getProfile);
router.get('/test-auth', sessionMiddleware, (req, res) => {
  res.json({ 
    message: 'Auth working', 
    user: req.user 
  });
});

// Add refresh and logout routes
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', sessionMiddleware, authController.logout);

// Admin routes
router.get('/users', sessionMiddleware, adminMiddleware, authController.getAllUsers);
router.put('/users/:userId/toggle-admin', sessionMiddleware, adminMiddleware, authController.toggleUserAdmin);

module.exports = router;
