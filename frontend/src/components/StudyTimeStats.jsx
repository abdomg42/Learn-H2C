import React from 'react';
import { Clock, TrendingUp, Calendar } from 'lucide-react';

const StudyTimeStats = ({ studyData }) => {
  // Mock data - In a real app, this would come from your backend
  const stats = {
    totalStudyTime: 45, // hours
    weeklyAverage: 12, // hours
    dailyStreak: 5, // days
    coursesInProgress: 2,
    completedCourses: 1,
    lastStudySession: '2 hours ago'
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Study Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Study Time */}
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Clock className="text-white" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Study Time</p>
              <p className="text-white text-xl font-semibold">{stats.totalStudyTime} hours</p>
            </div>
          </div>
        </div>

        {/* Weekly Average */}
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-green-600 p-2 rounded-lg">
              <TrendingUp className="text-white" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Weekly Average</p>
              <p className="text-white text-xl font-semibold">{stats.weeklyAverage} hours</p>
            </div>
          </div>
        </div>

        {/* Daily Streak */}
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-600 p-2 rounded-lg">
              <Calendar className="text-white" size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Daily Streak</p>
              <p className="text-white text-xl font-semibold">{stats.dailyStreak} days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-700 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Courses in Progress</p>
          <p className="text-white text-lg font-semibold">{stats.coursesInProgress}</p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Completed Courses</p>
          <p className="text-white text-lg font-semibold">{stats.completedCourses}</p>
        </div>
      </div>

      {/* Last Study Session */}
      <div className="mt-6 bg-gray-700 rounded-lg p-4">
        <p className="text-gray-400 text-sm">Last Study Session</p>
        <p className="text-white text-lg font-semibold">{stats.lastStudySession}</p>
      </div>
    </div>
  );
};

export default StudyTimeStats; 