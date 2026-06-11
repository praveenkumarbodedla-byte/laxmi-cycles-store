const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/dashboardController');
const { adminOnly } = require('../middleware/authMiddleware');

router.get('/stats', adminOnly, getStats);

module.exports = router;
