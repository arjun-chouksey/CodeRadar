const express = require('express');
const router = express.Router();
const contestController = require('../controllers/contestController');

// GET /api/contests - Get all contests with optional filters
router.get('/', contestController.getContests);

// GET /api/contests/upcoming - Get upcoming contests
router.get('/upcoming', contestController.getUpcomingContests);

// GET /api/contests/ongoing - Get ongoing contests
router.get('/ongoing', contestController.getOngoingContests);

// GET /api/contests/:platform - Get contests from specific platform
router.get('/:platform', contestController.getPlatformContests);

module.exports = router; 