const Cycle = require('../models/Cycle');

// @desc    Get all cycles (with filters, search, pagination)
// @route   GET /api/cycles
// @access  Public
const getCycles = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      brand,
      category,
      size,
      minPrice,
      maxPrice,
      isAvailable,
      search,
      sort = '-createdAt',
    } = req.query;

    const query = {};

    // Filters
    if (brand) query.brand = brand;
    if (category) query.category = category;
    if (size) query.size = size;
    if (isAvailable !== undefined) query.isAvailable = isAvailable === 'true';
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Text search — falls back to regex search across key fields
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { name: regex },
        { brand: regex },
        { size: regex },
        { color: regex },
        { category: regex },
      ];
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    const [cycles, total] = await Promise.all([
      Cycle.find(query).sort(sort).skip(skip).limit(limitNum).lean(),
      Cycle.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: cycles,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured cycles for homepage
// @route   GET /api/cycles/featured
// @access  Public
const getFeaturedCycles = async (req, res, next) => {
  try {
    const cycles = await Cycle.find({ isFeatured: true, isAvailable: true })
      .sort('-createdAt')
      .limit(6)
      .lean();
    res.json({ success: true, data: cycles });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single cycle
// @route   GET /api/cycles/:id
// @access  Public
const getCycle = async (req, res, next) => {
  try {
    const cycle = await Cycle.findById(req.params.id);
    if (!cycle) {
      return res.status(404).json({ success: false, message: 'Cycle not found' });
    }
    // Increment view count
    cycle.viewCount += 1;
    await cycle.save();

    // Get related cycles (same category, excluding current)
    const related = await Cycle.find({
      category: cycle.category,
      _id: { $ne: cycle._id },
      isAvailable: true,
    }).limit(4).lean();

    res.json({ success: true, data: cycle, related });
  } catch (error) {
    next(error);
  }
};

// @desc    Create cycle
// @route   POST /api/cycles
// @access  Admin
const createCycle = async (req, res, next) => {
  try {
    const {
      name, model, brand, category, price, description,
      specifications, isAvailable, isFeatured, tags,
      imageUrl, availability, size, color,
    } = req.body;

    const parsedSpecs = specifications ? (typeof specifications === 'string' ? JSON.parse(specifications) : specifications) : {};
    if (size) {
      parsedSpecs.wheelSize = size;
      parsedSpecs.frameSize = size;
    }
    if (color) {
      parsedSpecs.color = color;
    }

    const cycleData = {
      name: name || model,
      model: model || name,
      brand,
      category,
      price: Number(price),
      description,
      size: size || '',
      color: color || '',
      specifications: parsedSpecs,
      imageUrl,
      images: imageUrl ? [{ url: imageUrl, publicId: `custom_${Date.now()}` }] : [],
      isFeatured: isFeatured === 'true' || isFeatured === true,
      tags: tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : [],
    };

    if (availability) {
      cycleData.availability = availability;
    } else if (isAvailable !== undefined) {
      cycleData.isAvailable = isAvailable !== 'false' && isAvailable !== false;
    }

    const cycle = await Cycle.create(cycleData);

    res.status(201).json({ success: true, data: cycle, message: 'Cycle created successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cycle
// @route   PUT /api/cycles/:id
// @access  Admin
const updateCycle = async (req, res, next) => {
  try {
    const cycle = await Cycle.findById(req.params.id);
    if (!cycle) {
      return res.status(404).json({ success: false, message: 'Cycle not found' });
    }

    const {
      name, model, brand, category, price, description,
      specifications, isAvailable, isFeatured, tags,
      imageUrl, availability, size, color,
    } = req.body;

    // Update fields
    if (name) cycle.name = name;
    if (model) cycle.model = model;
    if (brand) cycle.brand = brand;
    if (category) cycle.category = category;
    if (price !== undefined) cycle.price = Number(price);
    if (description) cycle.description = description;

    if (size !== undefined) {
      cycle.size = size;
      if (!cycle.specifications) cycle.specifications = {};
      cycle.specifications.wheelSize = size;
      cycle.specifications.frameSize = size;
    }

    if (color !== undefined) {
      cycle.color = color;
      if (!cycle.specifications) cycle.specifications = {};
      cycle.specifications.color = color;
    }

    if (specifications) {
      cycle.specifications = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
    }
    if (isFeatured !== undefined) {
      cycle.isFeatured = isFeatured === 'true' || isFeatured === true;
    }
    if (tags) {
      cycle.tags = typeof tags === 'string' ? JSON.parse(tags) : tags;
    }

    if (imageUrl !== undefined) {
      cycle.imageUrl = imageUrl;
      if (imageUrl) {
        cycle.images = [{ url: imageUrl, publicId: `custom_${Date.now()}` }];
      } else {
        cycle.images = [];
      }
    }

    if (availability) {
      cycle.availability = availability;
    } else if (isAvailable !== undefined) {
      cycle.isAvailable = isAvailable !== 'false' && isAvailable !== false;
    }

    await cycle.save();
    res.json({ success: true, data: cycle, message: 'Cycle updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete cycle
// @route   DELETE /api/cycles/:id
// @access  Admin
const deleteCycle = async (req, res, next) => {
  try {
    const cycle = await Cycle.findById(req.params.id);
    if (!cycle) {
      return res.status(404).json({ success: false, message: 'Cycle not found' });
    }

    await cycle.deleteOne();
    res.json({ success: true, message: 'Cycle deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get unique brands and categories (for filters)
// @route   GET /api/cycles/meta
// @access  Public
const getCycleMeta = async (req, res, next) => {
  try {
    const [brands, categories] = await Promise.all([
      Cycle.distinct('brand'),
      Cycle.distinct('category'),
    ]);
    const priceRange = await Cycle.aggregate([
      { $group: { _id: null, min: { $min: '$price' }, max: { $max: '$price' } } },
    ]);
    res.json({
      success: true,
      data: {
        brands,
        categories,
        priceRange: priceRange[0] || { min: 0, max: 100000 },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCycles, getFeaturedCycles, getCycle, createCycle, updateCycle, deleteCycle, getCycleMeta };
