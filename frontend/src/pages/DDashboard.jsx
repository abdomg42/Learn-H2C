import React, { useState, useEffect } from 'react';
import TimeSpentCard from '../components/TimeSpentCard';
import CourseProgressCard from '../components/CourseProgressCard';
import DonutChart from '../components/DonutChart';
import { BookOpen } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

export default function DDashboard() {
  const { theme } = useTheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeByCategory, setTimeByCategory] = useState([]);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/users/me/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchTimeByCategory = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/courses/time_by_category/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        setTimeByCategory(response.data);
      } catch (error) {
        console.error('Error fetching time by category:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchTimeByCategory();
  }, []);

  // Dynamic classes based on theme
  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-800';
  const subTextClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';

  return (
    <div className="space-y-8">
      <div>
        <h1 className={`text-3xl p-2 font-bold ${textClass} transition-colors`}>
          Bienvenue {user?.first_name || user?.username || 'Abdellah'}
        </h1>
        <p className={`${subTextClass} transition-colors`}>
          Continuez votre apprentissage aujourd'hui
        </p>
      </div>

      {/* Stats Section - Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <TimeSpentCard />
        <CourseProgressCard />
        <DonutChart data={timeByCategory} />
      </div>
    </div>
  );
}
