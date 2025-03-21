const axios = require('axios');
const Contest = require('../models/Contest');

const fetchCodeforcesContests = async () => {
  try {
    const response = await axios.get('https://codeforces.com/api/contest.list');
    
    if (response.data.status !== 'OK') {
      throw new Error('Failed to fetch Codeforces contests');
    }
    
    const contests = response.data.result.map(contest => {
      // Convert Codeforces timestamp (seconds) to milliseconds
      const startTimeMs = contest.startTimeSeconds * 1000;
      const durationMs = contest.durationSeconds * 1000;
      const endTimeMs = startTimeMs + durationMs;
      
      // Determine contest status
      const now = Date.now();
      let status = 'UPCOMING';
      if (now > endTimeMs) {
        status = 'COMPLETED';
      } else if (now > startTimeMs) {
        status = 'ONGOING';
      }
      
      return {
        platform: 'Codeforces',
        name: contest.name,
        url: `https://codeforces.com/contest/${contest.id}`,
        startTime: new Date(startTimeMs),
        endTime: new Date(endTimeMs),
        duration: contest.durationSeconds,
        status
      };
    });
    
    return contests;
  } catch (error) {
    console.error('Error fetching Codeforces contests:', error.message);
    return [];
  }
};

const updateCodeforcesContests = async () => {
  try {
    const contests = await fetchCodeforcesContests();
    
    for (const contest of contests) {
      // Use upsert to update if exists or insert if not
      await Contest.findOneAndUpdate(
        { platform: 'Codeforces', name: contest.name },
        contest,
        { upsert: true, new: true }
      );
    }
    
    console.log('Codeforces contests updated successfully');
    return { success: true, count: contests.length };
  } catch (error) {
    console.error('Error updating Codeforces contests:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  fetchCodeforcesContests,
  updateCodeforcesContests
};
