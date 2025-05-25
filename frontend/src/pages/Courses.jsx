import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Play, Clock, Users, Star } from 'lucide-react';
import CardBase from '../components/CardBase';

const Courses = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  // Mock courses data - In a real app, this would come from your backend
  const mockCourses = [
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      description: "Learn web development from scratch with this comprehensive course",
      instructor: "John Doe",
      thumbnail: "https://img.youtube.com/vi/UB1O30fR-EE/maxresdefault.jpg",
      duration: "10 hours",
      students: 1234,
      rating: 4.8,
      progress: 0
    },
    {
      id: 2,
      title: "Python for Beginners",
      description: "Start your programming journey with Python",
      instructor: "Jane Smith",
      thumbnail: "https://img.youtube.com/vi/kqtD5dpn9C8/maxresdefault.jpg",
      duration: "8 hours",
      students: 856,
      rating: 4.7,
      progress: 35
    },
    {
      id: 3,
      title: "Data Science Fundamentals",
      description: "Master the basics of data science and analytics",
      instructor: "Mike Johnson",
      thumbnail: "https://img.youtube.com/vi/X3paOmcrTjQ/maxresdefault.jpg",
      duration: "12 hours",
      students: 2345,
      rating: 4.9,
      progress: 0
    }
  ];

  useEffect(() => {
    // Simulate loading courses data
    setTimeout(() => {
      setCourses(mockCourses);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleStartCourse = (courseId) => {
    console.log('Starting course with ID:', courseId);
    console.log('Course ID type:', typeof courseId);
    navigate(`/my-courses/${String(courseId)}`);
  };

  // Dynamic classes based on theme
  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-800';
  const subTextClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const hoverClass = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${textClass}`}>Available Courses</h1>
        <p className={`mt-2 ${subTextClass}`}>Start learning today with our expert-led courses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CardBase key={course.id}>
            <div className="relative">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              {course.progress > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                  <div
                    className="h-full bg-indigo-600"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              )}
            </div>

            <div className="p-4">
              <h2 className={`text-xl font-semibold ${textClass}`}>{course.title}</h2>
              <p className={`mt-2 ${subTextClass}`}>{course.description}</p>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Clock size={16} className={subTextClass} />
                    <span className={`text-sm ${subTextClass}`}>{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users size={16} className={subTextClass} />
                    <span className={`text-sm ${subTextClass}`}>{course.students}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star size={16} className="text-yellow-400" />
                    <span className={`text-sm ${subTextClass}`}>{course.rating}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleStartCourse(course.id)}
                className={`mt-4 w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200`}
              >
                <Play size={16} />
                <span>{course.progress > 0 ? 'Continue Course' : 'Start Course'}</span>
              </button>
            </div>
          </CardBase>
        ))}
      </div>
    </div>
  );
};

export default Courses; 