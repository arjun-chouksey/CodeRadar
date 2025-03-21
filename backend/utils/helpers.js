// Update contest statuses based on current time
const updateContestStatuses = async (Contest) => {
    const now = new Date();
    
    // Update contests that have started but not ended
    await Contest.updateMany(
      { status: 'UPCOMING', startTime: { $lte: now } },
      { $set: { status: 'ONGOING' } }
    );
    
    // Update contests that have ended
    await Contest.updateMany(
      { status: 'ONGOING', endTime: { $lte: now } },
      { $set: { status: 'COMPLETED' } }
    );
    
    console.log('Contest statuses updated');
  };
  
  module.exports = {
    updateContestStatuses
  };
  