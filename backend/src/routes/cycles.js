const express = require('express');
const router = express.Router();
const { adminOnly } = require('../middleware/authMiddleware');
const {
  getCycles, getFeaturedCycles, getCycle,
  createCycle, updateCycle, deleteCycle, getCycleMeta,
} = require('../controllers/cycleController');

router.get('/meta', getCycleMeta);
router.get('/featured', getFeaturedCycles);
router.get('/', getCycles);
router.get('/:id', getCycle);

// Admin routes
router.post('/', adminOnly, createCycle);
router.put('/:id', adminOnly, updateCycle);
router.delete('/:id', adminOnly, deleteCycle);

module.exports = router;
