const express = require('express');
const router = express.Router();
const {
  register,
  login,
  adminLogin,
  forgotPassword,
  getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/admin/login', adminLogin);
router.post('/forgot-password', forgotPassword);
router.get('/me', protect, getMe);

module.exports = router;
