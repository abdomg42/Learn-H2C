import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle, Play } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import CardBase from './CardBase';
import axios from 'axios';

export default function CourseProgressCard() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [courses, setCourses] = useState({
    inProgress: [],
    completed: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/courses/enrollments/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });

        // Process the enrollment data
        const allCourses = response.data.map(enrollment => ({
          id: enrollment.id,
          course: enrollment.course,
          progress: enrollment.progress || 0,
          is_completed: enrollment.completed || false
        }));

        // Separate courses into in-progress and completed
        const inProgress = allCourses.filter(course => !course.is_completed);
        const completed = allCourses.filter(course => course.is_completed);

        setCourses({
          inProgress,
          completed
        });
      } catch (error) {
        console.error('Error fetching course progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const handleCourseClick = (courseId) => {
    navigate(`/course-player/${courseId}`);
  };

  // Dynamic classes based on theme
  const titleClass = theme === 'dark' ? 'text-white' : 'text-gray-800';
  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-800';
  const subTextClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const inProgressClass = theme === 'dark' ? 'text-blue-400' : 'text-blue-600';
  const completedClass = theme === 'dark' ? 'text-green-400' : 'text-green-600';
  const borderClass = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const progressBgClass = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200';
  const buttonClass = theme === 'dark' 
    ? 'bg-blue-900/40 text-blue-300 hover:bg-blue-900/60' 
    : 'bg-blue-100 text-blue-700 hover:bg-blue-200';

  return (
    <CardBase>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${titleClass}`}>Progression des cours</h3>
        <BookOpen className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-24">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* En cours */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <BookOpen className={`w-5 h-5 ${inProgressClass}`} />
                <span className={`${textClass} transition-colors`}>En cours ({courses.inProgress.length})</span>
              </div>
            </div>
            
            {courses.inProgress.length > 0 ? (
              <div className="space-y-2">
                {courses.inProgress.map(course => (
                  <div 
                    key={course.id} 
                    className={`p-2 rounded-lg border ${borderClass} cursor-pointer hover:bg-opacity-50 ${
                      theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleCourseClick(course.course.id)}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-sm font-medium ${textClass}`}>{course.course.title}</span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs ${inProgressClass}`}>{Math.round(course.progress)}%</span>
                        <button 
                          className={`p-1 rounded-full ${buttonClass} transition-colors`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCourseClick(course.course.id);
                          }}
                        >
                          <Play size={14} />
                        </button>
                      </div>
                    </div>
                    <div className={`w-full ${progressBgClass} rounded-full h-1.5`}>
                      <div 
                        className="bg-blue-500 h-1.5 rounded-full" 
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={`text-sm ${subTextClass} py-2`}>Aucun cours en cours</p>
            )}
          </div>

          {/* Terminés */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className={`w-5 h-5 ${completedClass}`} />
                <span className={`${textClass} transition-colors`}>Terminés ({courses.completed.length})</span>
              </div>
            </div>
            
            {courses.completed.length > 0 ? (
              <div className="space-y-2">
                {courses.completed.map(course => (
                  <div 
                    key={course.id} 
                    className={`p-2 rounded-lg border ${borderClass} cursor-pointer hover:bg-opacity-50 ${
                      theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleCourseClick(course.course.id)}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-medium ${textClass}`}>{course.course.title}</span>
                      <div className="flex items-center space-x-2">
                        <Link 
                          to={`/certificates/${course.course.id}`}
                          className={`text-xs px-2 py-1 rounded-full ${
                            theme === 'dark' 
                              ? 'bg-green-900/40 text-green-300 hover:bg-green-900/60' 
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          Voir Certificat
                        </Link>
                        <button 
                          className={`p-1 rounded-full ${buttonClass} transition-colors`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCourseClick(course.course.id);
                          }}
                        >
                          <Play size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={`text-sm ${subTextClass} py-2`}>Aucun cours terminé</p>
            )}
          </div>
        </div>
      )}
    </CardBase>
  );
} 