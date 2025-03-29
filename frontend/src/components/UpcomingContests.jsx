import { useState } from 'react';
import { useQuery } from 'react-query';
import ContestCard from './ContestCard';
import { contestsApi } from '../services/api';

const UpcomingContests = () => {
  // State for filters
  const [platformFilter, setPlatformFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch upcoming contests
  const { data: contests, isLoading, error } = useQuery(
    'upcomingContests',
    () => contestsApi.getUpcomingContests(),
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

  // Group contests by date
  const groupByDate = (contests) => {
    const groups = {};
    
    contests.forEach(contest => {
      const date = new Date(contest.startTime).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      
      if (!groups[date]) {
        groups[date] = [];
      }
      
      groups[date].push(contest);
    });
    
    // Sort contests within each group by start time
    Object.keys(groups).forEach(date => {
      groups[date].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    });
    
    return groups;
  };

  const groupedContests = groupByDate(filteredContests);
  const dates = Object.keys(groupedContests).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA - dateB;
  });

  // Check if a date is today
  const isToday = (dateStr) => {
    const today = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return dateStr === today;
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
      <h1 className="text-3xl font-bold mb-8">Upcoming Contests</h1>
      
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
      
      {/* Results count */}
      <p className="text-gray-600 mb-4">
        Showing {filteredContests.length} upcoming {filteredContests.length === 1 ? 'contest' : 'contests'}
      </p>
      
      {/* Contest sections by date */}
      {filteredContests.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-500 text-lg">No upcoming contests found matching your filters.</p>
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
        dates.map(date => (
          <div key={date} className="mb-10">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              {date}
              {isToday(date) && (
                <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  Today
                </span>
              )}
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {groupedContests[date].map(contest => (
                <ContestCard key={contest.id} contest={contest} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UpcomingContests; 