const axios = require('axios');
const Contest = require('../models/Contest');

// Fetch contests from Codeforces API
const fetchCodeforcesContests = async () => {
  try {
    const response = await axios.get('https://codeforces.com/api/contest.list');
    
    if (response.data.status === 'OK') {
      const now = new Date();
      
      return response.data.result
        .filter(contest => !contest.phase.includes('FINISHED')) // Only get non-finished contests
        .map(contest => {
          const startTime = new Date(contest.startTimeSeconds * 1000);
          const endTime = new Date((contest.startTimeSeconds + contest.durationSeconds) * 1000);
          
          let status = 'upcoming';
          if (now >= startTime && now < endTime) {
            status = 'ongoing';
          } else if (now >= endTime) {
            status = 'completed';
          }
          
          return {
            name: contest.name,
            platform: 'codeforces',
            url: `https://codeforces.com/contest/${contest.id}`,
            startTime,
            endTime,
            duration: Math.round(contest.durationSeconds / 60), // Convert to minutes
            status,
            platformId: contest.id.toString()
          };
        });
    }
    return [];
  } catch (error) {
    console.error('Error fetching Codeforces contests:', error);
    return [];
  }
};

// Fetch contests from LeetCode API
const fetchLeetcodeContests = async () => {
  try {
    const response = await axios.post('https://leetcode.com/graphql', {
      query: `
      {
        allContests {
          title
          titleSlug
          startTime
          duration
        }
      }
      `
    });
    
    if (response.data && response.data.data && response.data.data.allContests) {
      const now = new Date();
      
      return response.data.data.allContests
        .filter(contest => contest.startTime) // Filter out contests with no start time
        .map(contest => {
          const startTime = new Date(contest.startTime * 1000);
          const endTime = new Date((contest.startTime + contest.duration) * 1000);
          
          let status = 'upcoming';
          if (now >= startTime && now < endTime) {
            status = 'ongoing';
          } else if (now >= endTime) {
            status = 'completed';
          }
          
          return {
            name: contest.title,
            platform: 'leetcode',
            url: `https://leetcode.com/contest/${contest.titleSlug}`,
            startTime,
            endTime,
            duration: Math.round(contest.duration / 60), // Convert to minutes
            status,
            platformId: contest.titleSlug
          };
        });
    }
    return [];
  } catch (error) {
    console.error('Error fetching LeetCode contests:', error);
    return [];
  }
};

// Update contest statuses based on current time
const updateContestStatuses = async () => {
  try {
    const now = new Date();
    
    // Update upcoming contests to ongoing
    await Contest.updateMany(
      { 
        status: 'upcoming',
        startTime: { $lte: now },
        endTime: { $gt: now }
      },
      { $set: { status: 'ongoing' } }
    );
    
    // Update ongoing contests to completed
    await Contest.updateMany(
      {
        status: 'ongoing',
        endTime: { $lte: now }
      },
      { $set: { status: 'completed' } }
    );
    
    console.log('Contest statuses updated successfully');
  } catch (error) {
    console.error('Error updating contest statuses:', error);
  }
};

// Fetch and save contests from all platforms
const fetchAndUpdateContests = async () => {
  try {
    // Fetch contests from all platforms
    const [codeforcesContests, leetcodeContests] = await Promise.all([
      fetchCodeforcesContests(),
      fetchLeetcodeContests()
    ]);
    
    const allContests = [...codeforcesContests, ...leetcodeContests];
    
    // Update each contest in database (upsert)
    for (const contest of allContests) {
      await Contest.findOneAndUpdate(
        { platform: contest.platform, platformId: contest.platformId },
        contest,
        { upsert: true, new: true }
      );
    }
    
    // Update contest statuses
    await updateContestStatuses();
    
    console.log(`Updated ${allContests.length} contests`);
    return { success: true, count: allContests.length };
  } catch (error) {
    console.error('Error in fetchAndUpdateContests:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  fetchCodeforcesContests,
  fetchLeetcodeContests,
  updateContestStatuses,
  fetchAndUpdateContests
}; 