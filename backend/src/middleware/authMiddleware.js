const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from DB
      console.log('MODEL:', Admin.modelName);
      console.log('COLLECTION:', Admin.collection.name);
      let user = await Admin.findById(decoded.id).select('-password');

      if (!user) {
        console.log('MODEL:', User.modelName);
        console.log('COLLECTION:', User.collection.name);
        user = await User.findById(decoded.id).select('-password');
      }

      if (!user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Session expired. Please login again.' });
      }
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

const adminOnly = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Verify admin role
      console.log('MODEL:', Admin.modelName);
      console.log('COLLECTION:', Admin.collection.name);
      let admin = await Admin.findById(decoded.id).select('-password');

      if (!admin) {
        console.log('MODEL:', User.modelName);
        console.log('COLLECTION:', User.collection.name);
        admin = await User.findById(decoded.id).select('-password');
      }
      if (!admin) {
        return res.status(401).json({ success: false, message: 'Not authorized, admin not found' });
      }

      if (admin.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access forbidden. Admin access required.' });
      }

      req.user = admin;
      next();
    } catch (error) {
      console.error('Admin middleware error:', error.message);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Session expired. Please login again.' });
      }
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

module.exports = { protect, adminOnly };
