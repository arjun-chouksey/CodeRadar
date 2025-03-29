import { useState } from 'react';
import { useQuery } from 'react-query';
import ContestCard from './ContestCard';
import { contestsApi } from '../services/api';

const OngoingContests = () => {
  // State for filters
  const [platformFilter, setPlatformFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch ongoing contests
  const { data: contests, isLoading, error } = useQuery(
    'ongoingContests',
    () => contestsApi.getOngoingContests(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Apply filters
  const filteredContests = contests?.filter(contest => {
    const matchesPlatform = platformFilter === 'all' || contest.platform.toLowerCase() === platformFilter.toLowerCase();
    const matchesSearch = contest.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesPlatform && matchesSearch;
  }) || [];

  // Sort by end time (soonest ending first)
  const sortedContests = [...filteredContests].sort((a, b) => {
    return new Date(a.endTime) - new Date(b.endTime);
  });

  // Calculate time remaining until end
  const getTimeRemaining = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diffMs = end - now;
    
    if (diffMs <= 0) return 'Ended';
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m remaining`;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> Failed to load contests. Please try again later.</span>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Ongoing Contests</h1>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search contests..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Platform filter */}
          <div>
            <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1">
              Platform
            </label>
            <select
              id="platform"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
            >
              <option value="all">All Platforms</option>
              <option value="codeforces">Codeforces</option>
              <option value="leetcode">LeetCode</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Results */}
      {sortedContests.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-500 text-lg">No ongoing contests at the moment.</p>
          <p className="text-sm text-gray-400 mt-2">Check back later or view upcoming contests.</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={() => {
              setPlatformFilter('all');
              setSearchQuery('');
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          {/* Results count */}
          <p className="text-gray-600 mb-4">
            Showing {sortedContests.length} ongoing {sortedContests.length === 1 ? 'contest' : 'contests'}
          </p>

          {/* Contest grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedContests.map(contest => (
              <div key={contest.id} className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-blue-500">
                <div className="p-4">
                  {/* Platform badge */}
                  <div className="flex justify-between items-start mb-3">
                    <span 
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        contest.platform.toLowerCase() === 'codeforces' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {contest.platform}
                    </span>

                    {/* Time remaining badge */}
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getTimeRemaining(contest.endTime)}
                    </span>
                  </div>
                  
                  {/* Contest Title */}
                  <h3 className="text-lg font-semibold mb-3">{contest.name}</h3>
                  
                  {/* Contest Times */}
                  <div className="space-y-1 text-sm text-gray-600 mb-4">
                    <div className="flex justify-between">
                      <span>Started at:</span>
                      <span>
                        {new Date(contest.startTime).toLocaleString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ends at:</span>
                      <span>
                        {new Date(contest.endTime).toLocaleString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <a
                    href={contest.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full mt-4 text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300"
                  >
                    Join Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default OngoingContests; 