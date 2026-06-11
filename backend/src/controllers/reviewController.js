const Review = require('../models/Review');

// @desc    Get approved reviews (public)
// @route   GET /api/reviews
// @access  Public
const getApprovedReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ isApproved: true })
      .sort('-createdAt')
      .limit(20)
      .lean();
    res.json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews (admin)
// @route   GET /api/reviews/all
// @access  Admin
const getAllReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, isApproved } = req.query;

    const query = {};
    if (isApproved !== undefined) query.isApproved = isApproved === 'true';

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    const [reviews, total] = await Promise.all([
      Review.find(query).sort('-createdAt').skip(skip).limit(limitNum).lean(),
      Review.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: reviews,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit review
// @route   POST /api/reviews
// @access  Public
const createReview = async (req, res, next) => {
  try {
    const { customerName, rating, comment } = req.body;
    const review = await Review.create({ customerName, rating: Number(rating), comment });
    res.status(201).json({
      success: true,
      message: 'Thank you for your review! It will be visible after approval.',
      data: { id: review._id },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve review
// @route   PUT /api/reviews/:id/approve
// @access  Admin
const approveReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: req.body.isApproved !== false },
      { new: true }
    );
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    res.json({ success: true, data: review, message: 'Review updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Admin
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getApprovedReviews, getAllReviews, createReview, approveReview, deleteReview };
