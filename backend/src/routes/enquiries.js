const express = require('express');
const router = express.Router();
const { adminOnly, protect } = require('../middleware/authMiddleware');
const {
  createEnquiry, getEnquiries, updateEnquiry, deleteEnquiry, enquiryLimiter, getMyEnquiries,
} = require('../controllers/enquiryController');

router.post('/', enquiryLimiter, createEnquiry);
router.get('/my', protect, getMyEnquiries);

// Admin routes
router.get('/', adminOnly, getEnquiries);
router.put('/:id', adminOnly, updateEnquiry);
router.delete('/:id', adminOnly, deleteEnquiry);

module.exports = router;
