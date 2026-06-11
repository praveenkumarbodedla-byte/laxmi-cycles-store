const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian mobile number'],
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [1000, 'Message cannot exceed 1000 characters'],
  },
  cycleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cycle',
    default: null,
  },
  cycleName: {
    type: String,
    default: 'General Enquiry',
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'closed'],
    default: 'new',
  },
  adminNotes: {
    type: String,
    default: '',
    maxlength: [500, 'Notes cannot exceed 500 characters'],
  },
}, {
  timestamps: true,
});

enquirySchema.index({ status: 1 });
enquirySchema.index({ createdAt: -1 });

const Enquiry = mongoose.model('Enquiry', enquirySchema);
module.exports = Enquiry;
