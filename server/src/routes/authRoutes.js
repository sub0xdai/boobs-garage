
// server/src/routes/authRoutes.js
import express from 'express';
import authController from '../controllers/authController.js';
import sessionMiddleware from '../middleware/sessionMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import { loginValidation, registerValidation, validate } from '../middleware/validationMiddleware.js';

const router = express.Router();

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

export default router;

