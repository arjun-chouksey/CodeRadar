import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import ContestCard from './ContestCard';
import { contestsApi } from '../services/api';

const HomePage = () => {
  // Get upcoming contests
  const { data: upcomingContests, isLoading: upcomingLoading, error: upcomingError } = useQuery(
    'upcomingContests',
    () => contestsApi.getUpcomingContests(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Get ongoing contests
  const { data: ongoingContests, isLoading: ongoingLoading, error: ongoingError } = useQuery(
    'ongoingContests',
    () => contestsApi.getOngoingContests(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Filter contests by platform
  const [platformFilter, setPlatformFilter] = useState('all');
  
  const filteredUpcoming = upcomingContests?.filter(contest => 
    platformFilter === 'all' || contest.platform.toLowerCase() === platformFilter.toLowerCase()
  ) || [];
  
  const filteredOngoing = ongoingContests?.filter(contest => 
    platformFilter === 'all' || contest.platform.toLowerCase() === platformFilter.toLowerCase()
  ) || [];

  // Check if upcoming contests are today
  const isToday = (dateString) => {
    const today = new Date();
    const contestDate = new Date(dateString);
    return (
      contestDate.getDate() === today.getDate() &&
      contestDate.getMonth() === today.getMonth() &&
      contestDate.getFullYear() === today.getFullYear()
    );
  };

  // Filter contests happening today
  const todayContests = filteredUpcoming.filter(contest => isToday(contest.startTime));

  // Loading state
  if (upcomingLoading || ongoingLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (upcomingError || ongoingError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> Failed to load contests. Please try again later.</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero section */}
      <div className="bg-blue-600 text-white rounded-lg p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to CodeRadar</h1>
        <p className="text-xl mb-6">
          Stay updated with the latest coding contests from Codeforces and LeetCode
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/upcoming"
            className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-2 rounded-md font-medium transition-colors"
          >
            Upcoming Contests
          </Link>
          <Link
            to="/ongoing"
            className="bg-blue-500 text-white hover:bg-blue-700 px-6 py-2 rounded-md font-medium transition-colors border border-white"
          >
            Ongoing Contests
          </Link>
        </div>
      </div>

      {/* Platform filter */}
      <div className="flex justify-center space-x-4">
        <button
          className={`px-4 py-2 rounded-md ${
            platformFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
          onClick={() => setPlatformFilter('all')}
        >
          All Platforms
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            platformFilter === 'codeforces' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
          onClick={() => setPlatformFilter('codeforces')}
        >
          Codeforces
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            platformFilter === 'leetcode' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
          onClick={() => setPlatformFilter('leetcode')}
        >
          LeetCode
        </button>
      </div>

      {/* Ongoing contests section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Ongoing Contests</h2>
          <Link to="/ongoing" className="text-blue-600 hover:underline">
            View All
          </Link>
        </div>
        
        {filteredOngoing.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No ongoing contests at the moment.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredOngoing.slice(0, 3).map((contest) => (
              <ContestCard key={contest.id} contest={contest} />
            ))}
          </div>
        )}
      </div>

      {/* Today's contests section */}
      {todayContests.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Today's Contests</h2>
            <Link to="/upcoming" className="text-blue-600 hover:underline">
              View All Upcoming
            </Link>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {todayContests.map((contest) => (
              <ContestCard key={contest.id} contest={contest} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming contests section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Upcoming Contests</h2>
          <Link to="/upcoming" className="text-blue-600 hover:underline">
            View All
          </Link>
        </div>
        
        {filteredUpcoming.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No upcoming contests found.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredUpcoming.slice(0, 6).map((contest) => (
              <ContestCard key={contest.id} contest={contest} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage; 