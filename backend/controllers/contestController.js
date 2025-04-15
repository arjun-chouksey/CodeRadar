const Contest = require('../models/Contest');
const codeforcesService = require('../services/codeforcesService');
const leetcodeService = require('../services/leetcodeService');

// Get all contests with optional filters
const getContests = async (req, res) => {
  try {
    const { platform, status, sort } = req.query;
    

    const oneYearAgo= new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const filter = {
      startTime: {$gte: oneYearAgo}
    };
    // Apply filters if provided
    if (platform) {
      filter.platform = platform.toLowerCase();
    }

    if (status) {
      filter.status = status.toLowerCase();
    }

    // Default sort by start time ascending
    const sortOption = sort === 'name' ? { name: 1 } : { startTime: 1 };

    const contests = await Contest.find(filter).sort(sortOption);
    
    res.json(contests);
  } catch (error) {
    console.error('Error fetching contests:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get upcoming contests
const getUpcomingContests = async (req, res) => {
  try {
    const { platform } = req.query;
    const now = new Date();
    const filter = {
      status: 'upcoming',
      startTime: { $gte: now }
    };

    if (platform) {
      filter.platform = platform.toLowerCase();
    }

    const contests = await Contest.find(filter).sort({ startTime: 1 });
    
    res.json(contests);
  } catch (error) {
    console.error('Error fetching upcoming contests:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get ongoing contests
const getOngoingContests = async (req, res) => {
  try {
    const { platform } = req.query;
    const now = new Date();
    const filter = {
      status: 'ongoing',
      startTime: { $lte: now },
      endTime: { $gte: now }
    };

    if (platform) {
      filter.platform = platform.toLowerCase();
    }

    const contests = await Contest.find(filter).sort({ endTime: 1 });
    
    res.json(contests);
  } catch (error) {
    console.error('Error fetching ongoing contests:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get completed contests
const getCompletedContests = async (req, res) => {
  try {
    const { platform } = req.query;
    
    const filter = { status: 'completed' };
    if (platform) filter.platform = platform;
    
    const contests = await Contest.find(filter).sort({ startTime: -1 }).limit(50);
    res.json(contests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get contests from specific platform
const getPlatformContests = async (req, res) => {
  try {
    const { platform } = req.params;
    const { status, sort } = req.query;
    
    if (!['codeforces', 'leetcode'].includes(platform.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid platform' });
    }

    const filter = { platform: platform.toLowerCase() };

    if (status) {
      filter.status = status.toLowerCase();
    }

    // Default sort by start time ascending
    const sortOption = sort === 'name' ? { name: 1 } : { startTime: 1 };

    const contests = await Contest.find(filter).sort(sortOption);
    
    res.json(contests);
  } catch (error) {
    console.error(`Error fetching ${req.params.platform} contests:`, error);
    res.status(500).json({ error: 'Server error' });
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
  getPlatformContests,
  updateAllContests
};
