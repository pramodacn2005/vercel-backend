const express = require('express');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get user profile
router.get('/', authMiddleware, async (req, res) => {
  try {
    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      company: req.user.company,
      createdAt: req.user.createdAt
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;


