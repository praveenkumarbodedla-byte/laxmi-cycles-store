const Cycle = require('../models/Cycle');
const Review = require('../models/Review');
const Enquiry = require('../models/Enquiry');
const User = require('../models/User');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Admin only
const getStats = async (req, res, next) => {
  try {
    const [
      totalCycles,
      availableCycles,
      oosCycles,
      totalReviews,
      totalEnquiries,
      registeredUsers,
      newEnquiries,
    ] = await Promise.all([
      Cycle.countDocuments(),
      Cycle.countDocuments({ isAvailable: true }),
      Cycle.countDocuments({ isAvailable: false }),
      Review.countDocuments(),
      Enquiry.countDocuments(),
      User.countDocuments(),
      Enquiry.countDocuments({ status: 'new' }),
    ]);

    res.json({
      success: true,
      data: {
        totalCycles,
        availableCycles,
        oosCycles,
        totalReviews,
        totalEnquiries,
        registeredUsers,
        newEnquiries,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
};
