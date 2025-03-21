const Contest = require('../models/Contest');
const codeforcesService = require('../services/codeforcesService');
const leetcodeService = require('../services/leetcodeService');

// Get all contests
const getContests = async (req, res) => {
  try {
    const { platform, status } = req.query;
    
    // Build filter object based on query parameters
    const filter = {};
    if (platform) filter.platform = platform;
    if (status) filter.status = status;
    
    const contests = await Contest.find(filter).sort({ startTime: 1 });
    res.json(contests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get upcoming contests
const getUpcomingContests = async (req, res) => {
  try {
    const { platform } = req.query;
    
    const filter = { status: 'UPCOMING' };
    if (platform) filter.platform = platform;
    
    const contests = await Contest.find(filter).sort({ startTime: 1 });
    res.json(contests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get ongoing contests
const getOngoingContests = async (req, res) => {
  try {
    const { platform } = req.query;
    
    const filter = { status: 'ONGOING' };
    if (platform) filter.platform = platform;
    
    const contests = await Contest.find(filter).sort({ endTime: 1 });
    res.json(contests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get completed contests
const getCompletedContests = async (req, res) => {
  try {
    const { platform } = req.query;
    
    const filter = { status: 'COMPLETED' };
    if (platform) filter.platform = platform;
    
    const contests = await Contest.find(filter).sort({ startTime: -1 }).limit(50);
    res.json(contests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update contests from all platforms
const updateAllContests = async (req, res) => {
  try {
    const codeforcesResult = await codeforcesService.updateCodeforcesContests();
    const leetcodeResult = await leetcodeService.updateLeetcodeContests();
    
    res.json({
      codeforces: codeforcesResult,
      leetcode: leetcodeResult
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getContests,
  getUpcomingContests,
  getOngoingContests,
  getCompletedContests,
  updateAllContests
};
