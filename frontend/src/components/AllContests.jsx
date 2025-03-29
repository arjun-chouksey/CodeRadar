import { useState } from 'react';
import { useQuery } from 'react-query';
import ContestCard from './ContestCard';
import { contestsApi } from '../services/api';

const AllContests = () => {
  // State for filters
  const [platformFilter, setPlatformFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('startTime'); // 'startTime' or 'name'

  // Fetch all contests
  const { data: contests, isLoading, error } = useQuery(
    'allContests',
    () => contestsApi.getAllContests(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Apply filters
  const filteredContests = contests?.filter(contest => {
    const matchesPlatform = platformFilter === 'all' || contest.platform.toLowerCase() === platformFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || contest.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch = contest.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesPlatform && matchesStatus && matchesSearch;
  }) || [];

  // Sort contests
  const sortedContests = [...filteredContests].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else { // sortBy === 'startTime'
      return new Date(a.startTime) - new Date(b.startTime);
    }
  });

  // Handle platform filter change
  const handlePlatformChange = (e) => {
    setPlatformFilter(e.target.value);
  };

  // Handle status filter change
  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Handle search change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
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
      <h1 className="text-3xl font-bold mb-8">All Contests</h1>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
              onChange={handleSearchChange}
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
              onChange={handlePlatformChange}
            >
              <option value="all">All Platforms</option>
              <option value="codeforces">Codeforces</option>
              <option value="leetcode">LeetCode</option>
            </select>
          </div>
          
          {/* Status filter */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={handleStatusChange}
            >
              <option value="all">All Statuses</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          {/* Sort by */}
          <div>
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              id="sortBy"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="startTime">Start Time</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Results count */}
      <p className="text-gray-600 mb-4">
        Showing {sortedContests.length} {sortedContests.length === 1 ? 'contest' : 'contests'}
      </p>
      
      {/* Contest grid */}
      {sortedContests.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-500 text-lg">No contests found matching your filters.</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={() => {
              setPlatformFilter('all');
              setStatusFilter('all');
              setSearchQuery('');
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedContests.map((contest) => (
            <ContestCard key={contest.id} contest={contest} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllContests; 