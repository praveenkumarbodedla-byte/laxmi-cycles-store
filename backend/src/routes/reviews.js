const express = require('express');
const router = express.Router();
const { adminOnly } = require('../middleware/authMiddleware');
const {
  getApprovedReviews, getAllReviews, createReview, approveReview, deleteReview,
} = require('../controllers/reviewController');

router.get('/', getApprovedReviews);
router.post('/', createReview);

// Admin routes
router.get('/all', adminOnly, getAllReviews);
router.put('/:id/approve', adminOnly, approveReview);
router.delete('/:id', adminOnly, deleteReview);

module.exports = router;
