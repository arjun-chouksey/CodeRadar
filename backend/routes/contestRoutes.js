const express = require('express');
const router = express.Router();
const {
  getContests,
  getUpcomingContests,
  getOngoingContests,
  getCompletedContests,
  updateAllContests
} = require('../controllers/contestController');

// Get all contests (with optional filtering)
router.get('/', getContests);

// Get upcoming contests
router.get('/upcoming', getUpcomingContests);

// Get ongoing contests
router.get('/ongoing', getOngoingContests);

// Get completed contests
router.get('/completed', getCompletedContests);

// Update contests from all platforms
router.post('/update', updateAllContests);

module.exports = router;
