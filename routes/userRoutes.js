const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getProfile } = require('../controllers/userController');

// Example
router.get('/profile', protect, getProfile);
router.post('/forgot-password', forgotPassword);


module.exports = router;
