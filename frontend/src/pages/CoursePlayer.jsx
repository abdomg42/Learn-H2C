import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { ChevronLeft, ChevronRight, Play, CheckCircle, Clock, Download, FileText, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

// Mock course data with real YouTube playlists
const mockCourses = {
  '1': {
    id: 1,
    title: "Architecture JEE et Systèmes Distribués",
    description: "Architecture JEE et Systèmes Distribués",
    instructor: "Mohamed YOUSSFI",
    thumbnail: "https://img.youtube.com/vi/PZAAEgvbgLw/maxresdefault.jpg",
    duration: "10 hours",
    students: 1234,
    rating: 4.8,
    sections: [
      {
        id: 1,
        title: "Part 1- JEE Inversion de contrôle et Injection des dépendance Master IIBDCC ENSET",
        lessons: [
          {
            id: 1,
            title: "Part 1- JEE Inversion de contrôle et Injection des dépendance Master IIBDCC ENSET",
            description: "Part 1- JEE Inversion de contrôle et Injection des dépendance Master IIBDCC ENSET",
            video_url: "PZAAEgvbgLw",
            duration: "3:03:56"
          }
        ]
      },
      {
        id: 5,
        title: "JavaScript Fundamentals",
        lessons: [
          {
            id: 3,
            title: "JavaScript Crash Course",
            description: "Learn JavaScript from scratch in this comprehensive crash course",
            video_url: "W6NZfCO5SIk",
            duration: "1:40:00"
          },
          {
            id: 4,
            title: "DOM Manipulation",
            description: "Master DOM manipulation with JavaScript",
            video_url: "0ik6X4DJKCc",
            duration: "45:00"
          }
        ]
      }
    ]
  },
  '2': {
    id: 2,
    title: "Python for Beginners",
    description: "Start your programming journey with Python. Learn Python programming from scratch with hands-on projects.",
    instructor: "Jane Smith",
    thumbnail: "https://img.youtube.com/vi/kqtD5dpn9C8/maxresdefault.jpg",
    duration: "8 hours",
    students: 856,
    rating: 4.7,
    sections: [
      {
        id: 1,
        title: "Python Basics",
        lessons: [
          {
            id: 1,
            title: "Django REST API ",
            description: "Learn Python programming from scratch",
            video_url: "t-uAgI-AUxc",
            duration: "0:40:17"
          },
          {
            id: 2,
            title: "Django REST API",
            description: "Django REST API",
            video_url: "cJveiktaOSQ",
            duration: "53:00"
          }
        ]
      }
    ]
  },
  '3': {
    id: 3,
    title: "Data Science Fundamentals",
    description: "Master the basics of data science and analytics. Learn Python, statistics, and machine learning.",
    instructor: "Mike Johnson",
    thumbnail: "https://img.youtube.com/vi/X3paOmcrTjQ/maxresdefault.jpg",
    duration: "12 hours",
    students: 2345,
    rating: 4.9,
    sections: [
      {
        id: 1,
        title: "Introduction to Data Science",
        lessons: [
          {
            id: 1,
            title: "Data Science Crash Course",
            description: "Complete introduction to data science",
            video_url: "X3paOmcrTjQ",
            duration: "1:51:00"
          },
          {
            id: 2,
            title: "Python for Data Science",
            description: "Learn Python for data analysis and visualization",
            video_url: "LHBE6Q9XlzI",
            duration: "1:00:00"
          }
        ]
      }
    ]
  }
};

const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [videoError, setVideoError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [course, setCourse] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [completedLessons, setCompletedLessons] = useState(new Set());

  // Calculate total lessons in the course
  const totalLessons = course?.sections.reduce((total, section) => total + section.lessons.length, 0) || 0;

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // Simulate loading course data
        const courseData = mockCourses[courseId];
        if (!courseData) {
          setVideoError(`Course not found: ${courseId}`);
          setIsLoading(false);
          return;
        }

        setCourse(courseData);

        // Set initial video to first video of first section
        if (courseData.sections && courseData.sections.length > 0) {
          const firstSection = courseData.sections[0];
          if (firstSection.lessons && firstSection.lessons.length > 0) {
            const firstLesson = firstSection.lessons[0];
            setCurrentSection(firstSection);
            setCurrentVideo(firstLesson);
            setSelectedVideo(firstLesson);
          }
        }

        // Fetch progress data
        try {
          const response = await axios.get(`http://localhost:8000/api/courses/${courseId}/progress/`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
          });
          setProgress(response.data.overall_progress || 0);
          
          // Set completed lessons from the response
          const completed = new Set();
          response.data.sections?.forEach(section => {
            section.lessons?.forEach(lesson => {
              if (lesson.progress?.completed) {
                completed.add(lesson.id);
              }
            });
          });
          setCompletedLessons(completed);
        } catch (error) {
          console.error('Error fetching progress:', error);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setVideoError('Error loading course');
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const handleVideoSelect = (lesson) => {
    setSelectedVideo(lesson);
    setCurrentVideo(lesson);
    const section = course.sections.find(s => s.lessons.some(l => l.id === lesson.id));
    setCurrentSection(section);
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleMarkComplete = async () => {
    if (!selectedVideo || isMarkingComplete) return;
    
    setIsMarkingComplete(true);
    try {
      // Update completed lessons
      setCompletedLessons(prev => {
        const newSet = new Set(prev);
        newSet.add(selectedVideo.id);
        return newSet;
      });

      // Calculate new progress
      const newProgress = ((completedLessons.size + 1) / totalLessons) * 100;
      setProgress(newProgress);

      // Show success message
      toast.success('Lesson marked as complete!');
    } catch (error) {
      console.error('Error marking lesson as complete:', error);
      toast.error('Failed to mark lesson as complete');
    } finally {
      setIsMarkingComplete(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (videoError || !course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-xl font-bold text-white mb-2">Error Loading Course</h2>
          <p className="text-gray-400 mb-4">{videoError || 'Course not found'}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Toaster position="top-right" />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Video Player */}
        <div className="flex-1 relative bg-black">
          {selectedVideo ? (
            <div className="w-full h-full">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.video_url}?autoplay=0`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 dark:text-gray-400">Select a lesson to start learning</p>
            </div>
          )}
        </div>

        {/* Bottom Control Bar */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedVideo?.title || 'Select a lesson'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {selectedVideo?.description || 'No description available'}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Progress Display */}
              <div className="flex items-center gap-2">
                {progress >= 100 && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Course Completed!
                  </span>
                )}
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {Math.round(progress)}% Complete
                </span>
              </div>

              {/* Mark as Complete Button */}
              <button
                onClick={handleMarkComplete}
                disabled={isMarkingComplete || completedLessons.has(selectedVideo?.id)}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg ${
                  isMarkingComplete 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : completedLessons.has(selectedVideo?.id)
                      ? 'bg-green-100 text-green-800 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                } transition-colors`}
              >
                {isMarkingComplete ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Marking...
                  </>
                ) : completedLessons.has(selectedVideo?.id) ? (
                  <>
                    <CheckCircle size={20} />
                    Completed
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Mark as Done
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-1 text-sm text-gray-600 dark:text-gray-400">
              <span>{Math.round(progress)}% Complete</span>
              <span>{completedLessons.size} of {totalLessons} lessons completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content Sidebar */}
      <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Course Content</h2>
            <button
              onClick={() => setExpandedSections(prev => ({ ...prev, sidebar: !prev.sidebar }))}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <ChevronRight size={20} className={`transform transition-transform ${expandedSections.sidebar ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          {course.sections.map(section => (
            <div key={section.id} className="mb-4">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-2 text-left text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <span className="font-medium">{section.title}</span>
                {expandedSections[section.id] ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
              
              {expandedSections[section.id] && (
                <div className="mt-2 space-y-1">
                  {section.lessons.map(lesson => {
                    const lessonProgress = progress?.sections
                      ?.find(s => s.id === section.id)
                      ?.lessons.find(l => l.id === lesson.id);

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => handleVideoSelect(lesson)}
                        className={`w-full flex items-center p-2 text-left rounded ${
                          selectedVideo?.id === lesson.id
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Play size={16} className="mr-2" />
                        <span className="truncate">{lesson.title}</span>
                        <span className="ml-auto text-sm whitespace-nowrap">{lesson.duration}</span>
                        {completedLessons.has(lesson.id) && (
                          <CheckCircle size={16} className="ml-2 text-green-500 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer; 