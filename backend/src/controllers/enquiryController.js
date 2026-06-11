const Enquiry = require('../models/Enquiry');
const rateLimit = require('express-rate-limit');

// Strict rate limiter for enquiry submission (3 per hour per IP)
const enquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: { success: false, message: 'Too many enquiries from this IP. Please try again after 1 hour.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// @desc    Submit enquiry
// @route   POST /api/enquiries
// @access  Public
const createEnquiry = async (req, res, next) => {
  try {
    const { name, email, phone, message, cycleId, cycleName } = req.body;

    const enquiry = await Enquiry.create({
      name,
      email,
      phone,
      message,
      cycleId: cycleId || null,
      cycleName: cycleName || 'General Enquiry',
    });

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully! We will contact you soon.',
      data: { id: enquiry._id },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all enquiries (admin)
// @route   GET /api/enquiries
// @access  Admin
const getEnquiries = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const query = {};
    if (status) query.status = status;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    const [enquiries, total] = await Promise.all([
      Enquiry.find(query)
        .sort('-createdAt')
        .skip(skip)
        .limit(limitNum)
        .populate('cycleId', 'name brand')
        .lean(),
      Enquiry.countDocuments(query),
    ]);

    // Count by status
    const statusCounts = await Enquiry.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: enquiries,
      statusCounts: statusCounts.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {}),
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update enquiry status / notes
// @route   PUT /api/enquiries/:id
// @access  Admin
const updateEnquiry = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { ...(status && { status }), ...(adminNotes !== undefined && { adminNotes }) },
      { new: true, runValidators: true }
    );

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    res.json({ success: true, data: enquiry, message: 'Enquiry updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete enquiry
// @route   DELETE /api/enquiries/:id
// @access  Admin
const deleteEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }
    res.json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's enquiries
// @route   GET /api/enquiries/my
// @access  Private
const getMyEnquiries = async (req, res, next) => {
  try {
    const email = req.user.email;
    const enquiries = await Enquiry.find({ email }).sort('-createdAt').lean();
    res.json({ success: true, data: enquiries });
  } catch (error) {
    next(error);
  }
};

module.exports = { createEnquiry, getEnquiries, updateEnquiry, deleteEnquiry, enquiryLimiter, getMyEnquiries };
