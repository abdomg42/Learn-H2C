import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Users, Star, BookOpen, ChevronDown, ChevronUp, Play, Lock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [expandedSections, setExpandedSections] = useState({});
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // Fetch course details
        const courseResponse = await axios.get(`http://localhost:8000/api/courses/${courseId}/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });

        setCourse(courseResponse.data);
        
        // Fetch course progress
        const progressResponse = await axios.get(`http://localhost:8000/api/courses/my-progress/${courseId}/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });

        setProgress(progressResponse.data);
        
        // Set initial video to first video of first section if available
        if (courseResponse.data.sections && courseResponse.data.sections.length > 0) {
          const firstSection = courseResponse.data.sections[0];
          if (firstSection.lessons && firstSection.lessons.length > 0) {
            setSelectedVideo(firstSection.lessons[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        setError(error.response?.data?.detail || 'Error loading course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleVideoSelect = async (video) => {
    setSelectedVideo(video);
    
    // Track time spent on the previous video if it exists
    if (selectedVideo) {
      try {
        await axios.post(`http://localhost:8000/api/courses/${courseId}/track_time/`, {
          duration: 300 // 5 minutes in seconds
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
      } catch (error) {
        console.error('Error tracking time:', error);
      }
    }
  };

  const handleVideoComplete = async () => {
    if (!selectedVideo) return;

    try {
      await axios.post(`http://localhost:8000/api/courses/${courseId}/update_progress/`, {
        progress: progress.overall_progress + (100 / course.sections.reduce((acc, section) => acc + section.lessons.length, 0)),
        is_completed: progress.overall_progress >= 100
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      // Refresh progress
      const progressResponse = await axios.get(`http://localhost:8000/api/courses/my-progress/${courseId}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setProgress(progressResponse.data);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  if (loading) {
  return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">Error Loading Course</h2>
          <p className="text-gray-400 mb-4">{error || 'Course not found'}</p>
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
      {/* Video Player */}
      <div className="flex-1 p-4">
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          {selectedVideo ? (
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo.video_url}?autoplay=1`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onEnded={handleVideoComplete}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              Select a video to start learning
            </div>
          )}
          </div>
        
        <div className="mt-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {selectedVideo ? selectedVideo.title : course.title}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {course.description}
          </p>
        </div>
      </div>

      {/* Course Content */}
      <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Course Content</h2>
          
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
                      .find(s => s.id === section.id)
                      ?.lessons.find(l => l.id === lesson.id)?.progress;

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
                        <span>{lesson.title}</span>
                        <span className="ml-auto text-sm">{lesson.duration}</span>
                        {lessonProgress?.completed && (
                          <span className="ml-2 text-green-500">✓</span>
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

export default CourseDetail; 