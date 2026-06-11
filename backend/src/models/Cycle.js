const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, required: true },
}, { _id: false });

const specificationsSchema = new mongoose.Schema({
  weight: { type: String, default: '' },
  gears: { type: String, default: '' },
  frameSize: { type: String, default: '' },
  frameMaterial: { type: String, default: '' },
  brakeType: { type: String, default: '' },
  wheelSize: { type: String, default: '' },
  suspension: { type: String, default: '' },
  color: { type: String, default: '' },
}, { _id: false });

const cycleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Cycle name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  model: {
    type: String,
    trim: true,
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true,
    enum: {
      values: ['Hero', 'Vesco', 'Sun Bride', 'Afro', 'Atlas', 'Avon', 'BSA', 'Firefox', 'Hercules', 'Montra', 'Other'],
      message: '{VALUE} is not a supported brand',
    },
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Mountain', 'Road', 'Kids', 'Sports', 'Electric', 'Hybrid', 'City'],
      message: '{VALUE} is not a supported category',
    },
  },
  size: {
    type: String,
    default: '',
    trim: true,
  },
  color: {
    type: String,
    default: '',
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  specifications: {
    type: specificationsSchema,
    default: {},
  },
  images: {
    type: [imageSchema],
    validate: {
      validator: (arr) => arr.length <= 10,
      message: 'Cannot upload more than 10 images',
    },
  },
  imageUrl: {
    type: String,
    trim: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  availability: {
    type: String,
    enum: ['available', 'limited_stock', 'out_of_stock'],
    default: 'available',
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  tags: {
    type: [String],
    default: [],
  },
  viewCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Sync pre-save hook
cycleSchema.pre('save', function (next) {
  if (this.model && !this.name) {
    this.name = this.model;
  } else if (this.name && !this.model) {
    this.model = this.name;
  }

  if (this.imageUrl) {
    if (!this.images || this.images.length === 0) {
      this.images = [{ url: this.imageUrl, publicId: `custom_${Date.now()}` }];
    } else if (this.images[0].url !== this.imageUrl) {
      this.images[0] = { url: this.imageUrl, publicId: this.images[0].publicId || `custom_${Date.now()}` };
    }
  } else if (this.images && this.images.length > 0) {
    this.imageUrl = this.images[0].url;
  }

  if (this.availability) {
    this.isAvailable = this.availability !== 'out_of_stock';
  } else {
    this.availability = this.isAvailable ? 'available' : 'out_of_stock';
  }

  next();
});

// Indexes for search performance
cycleSchema.index({ name: 'text', description: 'text', brand: 'text', size: 'text', color: 'text' });
cycleSchema.index({ brand: 1, category: 1, size: 1 });
cycleSchema.index({ price: 1 });
cycleSchema.index({ isFeatured: 1, isAvailable: 1 });

const Cycle = mongoose.model('Cycle', cycleSchema);
module.exports = Cycle;
