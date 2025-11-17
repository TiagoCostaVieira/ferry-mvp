const express = require('express');
const {
  getFerries,
  getFerry,
  getFerrySchedule,
  createFerry,
  updateFerry,
  updateOccupancy,
  updateStatus,
  deleteFerry,
  searchFerries
} = require('../controllers/ferryController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getFerries);
router.get('/search', searchFerries);
router.get('/:id', getFerry);
router.get('/:id/schedule', getFerrySchedule);

// Protect all routes below
// router.use(protect);

// Admin only routes
// router.use(authorize('admin'));

// Temporariamente desprotegidas para teste
router.post('/', createFerry);
router.put('/:id', updateFerry);
router.patch('/:id/occupancy', updateOccupancy);
router.patch('/:id/status', updateStatus);
router.delete('/:id', deleteFerry);

module.exports = router;