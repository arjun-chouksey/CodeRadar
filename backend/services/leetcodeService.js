const axios = require('axios');
const Contest = require('../models/Contest');

const fetchLeetcodeContests = async () => {
  try {
    // LeetCode doesn't have an official API, so we'll use their GraphQL endpoint
    const response = await axios.post('https://leetcode.com/graphql', {
      query: `
        query {
          allContests {
            title
            titleSlug
            startTime
            duration
            status
          }
        }
      `
    });
    
    if (!response.data || !response.data.data || !response.data.data.allContests) {
      throw new Error('Failed to fetch LeetCode contests');
    }
    
    const contests = response.data.data.allContests.map(contest => {
      // Convert LeetCode timestamp (seconds) to milliseconds
      const startTimeMs = contest.startTime * 1000;
      const durationMs = contest.duration * 1000;
      const endTimeMs = startTimeMs + durationMs;
      
      // Map LeetCode status to our status format
      let status;
      switch (contest.status) {
        case 'STARTED':
          status = 'ONGOING';
          break;
        case 'FINISHED':
          status = 'COMPLETED';
          break;
        default:
          status = 'UPCOMING';
      }
      
      return {
        platform: 'LeetCode',
        name: contest.title,
        url: `https://leetcode.com/contest/${contest.titleSlug}`,
        startTime: new Date(startTimeMs),
        endTime: new Date(endTimeMs),
        duration: contest.duration,
        status
      };
    });
    
    return contests;
  } catch (error) {
    console.error('Error fetching LeetCode contests:', error.message);
    return [];
  }
};

const updateLeetcodeContests = async () => {
  try {
    const contests = await fetchLeetcodeContests();
    
    for (const contest of contests) {
      // Use upsert to update if exists or insert if not
      await Contest.findOneAndUpdate(
        { platform: 'LeetCode', name: contest.name },
        contest,
        { upsert: true, new: true }
      );
    }
    
    console.log('LeetCode contests updated successfully');
    return { success: true, count: contests.length };
  } catch (error) {
    console.error('Error updating LeetCode contests:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  fetchLeetcodeContests,
  updateLeetcodeContests
};
