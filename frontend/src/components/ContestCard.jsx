import { format } from 'date-fns';
import PropTypes from 'prop-types';

const ContestCard = ({ contest }) => {
  // Determine the status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return 'bg-green-100 text-green-800';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Determine the platform color
  const getPlatformColor = (platform) => {
    switch (platform.toLowerCase()) {
      case 'codeforces':
        return 'bg-red-100 text-red-800';
      case 'leetcode':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate time remaining for upcoming contests
  const getTimeRemaining = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const diffMs = start - now;
    
    if (diffMs <= 0) return null;
    
    // Convert to days, hours, minutes
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h remaining`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    } else {
      return `${minutes}m remaining`;
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  };

  // Get time remaining display
  const timeRemaining = contest.status.toLowerCase() === 'upcoming' 
    ? getTimeRemaining(contest.startTime) 
    : null;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">
        {/* Header with Platform and Status */}
        <div className="flex justify-between items-start mb-3">
          <span 
            className={`px-2 py-1 rounded-full text-xs font-medium ${getPlatformColor(contest.platform)}`}
          >
            {contest.platform}
          </span>
          <span 
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contest.status)}`}
          >
            {contest.status}
          </span>
        </div>
        
        {/* Contest Title */}
        <h3 className="text-lg font-semibold line-clamp-2 mb-2">{contest.name}</h3>
        
        {/* Contest Times */}
        <div className="space-y-1 text-sm text-gray-600 mb-3">
          <div className="flex justify-between">
            <span className="font-medium">Start:</span>
            <span>{formatDate(contest.startTime)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Duration:</span>
            <span>{contest.duration} min</span>
          </div>
          
          {/* Time Remaining for Upcoming Contests */}
          {timeRemaining && (
            <div className="mt-2 text-center">
              <span className="font-medium text-blue-600">{timeRemaining}</span>
            </div>
          )}
        </div>
        
        {/* Action Button */}
        <a
          href={contest.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full mt-4 text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300"
        >
          View Contest
        </a>
      </div>
    </div>
  );
};

ContestCard.propTypes = {
  contest: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    platform: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired
  }).isRequired
};

export default ContestCard; 