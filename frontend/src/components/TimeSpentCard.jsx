import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const TimeSpentCard = () => {
  const { theme } = useTheme();
  const [timeSpent, setTimeSpent] = useState(0);
  const [timeByCategory, setTimeByCategory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeData = async () => {
      try {
        const timeSpentResponse = await axios.get('http://localhost:8000/api/courses/time_spent/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        setTimeSpent(timeSpentResponse.data);

        const timeByCategoryResponse = await axios.get('http://localhost:8000/api/courses/time_by_category/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        setTimeByCategory(timeByCategoryResponse.data);
      } catch (error) {
        console.error('Error fetching time data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeData();
  }, []);

  // Convert seconds to hours and minutes
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const bgClass = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-800';
  const subTextClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const categoryTextClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';

  return (
    <div className={`p-6 rounded-xl shadow-md ${bgClass} transition-colors`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${textClass} transition-colors`}>Temps d'apprentissage</h3>
        <Clock className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-24">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <p className={`text-3xl font-bold ${textClass} transition-colors`}>
              {formatTime(timeSpent)}
            </p>
            <p className={`text-sm ${subTextClass} transition-colors`}>
              Temps total passé sur les cours cette semaine
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSpentCard; 