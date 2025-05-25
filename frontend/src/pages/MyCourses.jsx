import React, { useState, useEffect } from 'react';
import CourseCard from '../components/CourseCard';
import { Search, Filter, LayoutGrid, List, SortAsc, SortDesc, BookOpen, CheckCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import CardBase from '../components/CardBase';
import jee from '../assets/course-jee.png';

export default function MyCourses() {
  const { theme } = useTheme();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, in-progress, completed
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [sortOrder, setSortOrder] = useState('asc'); // asc, desc
  const [sortBy, setSortBy] = useState('title'); // title, date, progress
  useEffect(() => {
    // Fetch courses from backend
    const fetchCourses = async () => {
      try {
        // In a real app, this would be an actual API call
        // const response = await fetch('http://localhost:8000/api/courses/enrolled/', {
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`
        //   }
        // });
        // const data = await response.json();
        
        // Mock data for now
        const data = [
          {
            id: 1,
            title: 'Architecture JEE et Systèmes Distribués',
            description: 'Architecture JEE et Systèmes Distribués',
            category: 'JEE',
            image: jee,
            progress: 100,
            lastAccessed: '2024-05-25T10:30:00',
            enrolledDate: '2024-05-10T08:15:00'
          },
          {
            id: 2,
            title: 'Django REST Framework',
            description: 'Créez des APIs puissantes avec Django REST',
            category: 'Backend',
            image: '/course-django.jpg',
            progress: 30,
            lastAccessed: '2024-05-16T14:45:00',
            enrolledDate: '2024-04-05T11:20:00'
          },
          {
            id: 3,
            title: 'Diagrammes UML',
            description: 'Maîtrisez la modélisation avec UML',
            category: 'UML',
            image: '/course-uml.jpg',
            progress: 100,
            lastAccessed: '2024-05-10T09:15:00',
            enrolledDate: '2024-03-20T10:00:00'
          },
          {
            id: 4,
            title: 'CSS Avancé avec TailwindCSS',
            description: 'Design moderne et réactif avec TailwindCSS',
            category: 'Frontend',
            image: '/course-tailwind.jpg',
            progress: 0,
            lastAccessed: null,
            enrolledDate: '2024-05-01T16:30:00'
          },
          {
            id: 5,
            title: 'Bases du JavaScript',
            description: 'Fondamentaux du JavaScript pour le web dynamique',
            category: 'Web statique',
            image: '/course-js.jpg',
            progress: 15,
            lastAccessed: '2024-05-14T11:20:00',
            enrolledDate: '2024-04-15T09:45:00'
          },
          {
            id: 6,
            title: 'PHP et MySQL',
            description: 'Développez des applications web avec PHP et MySQL',
            category: 'Web dynamique',
            image: '/course-php.jpg',
            progress: 0,
            lastAccessed: null,
            enrolledDate: '2024-05-05T14:10:00'
          },
          {
            id: 7,
            title: 'Programmation Orientée Objet en Java',
            description: 'Maîtrisez les concepts de POO avec Java',
            category: 'Java POO',
            image: '/course-java.jpg',
            progress: 100,
            lastAccessed: '2024-04-25T13:40:00',
            enrolledDate: '2024-03-10T08:30:00'
          }
        ];
        
        setCourses(data);
        setFilteredCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Apply filters, search and sort whenever these values change
  useEffect(() => {
    let result = [...courses];
    
    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(course => {
        if (filterStatus === 'completed') {
          return course.progress === 100;
        } else if (filterStatus === 'in-progress') {
          return course.progress > 0 && course.progress < 100;
        } else if (filterStatus === 'not-started') {
          return course.progress === 0;
        }
        return true;
      });
    }
    
    // Apply search
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      result = result.filter(
        course => course.title.toLowerCase().includes(lowercasedSearch) ||
                 course.category.toLowerCase().includes(lowercasedSearch) ||
                 course.description.toLowerCase().includes(lowercasedSearch)
      );
    }
    
    // Apply sort
    result.sort((a, b) => {
      let comparisonResult = 0;
      
      if (sortBy === 'title') {
        comparisonResult = a.title.localeCompare(b.title);
      } else if (sortBy === 'date') {
        const dateA = new Date(a.enrolledDate);
        const dateB = new Date(b.enrolledDate);
        comparisonResult = dateA - dateB;
      } else if (sortBy === 'progress') {
        comparisonResult = a.progress - b.progress;
      }
      
      return sortOrder === 'asc' ? comparisonResult : -comparisonResult;
    });
    
    setFilteredCourses(result);
  }, [courses, filterStatus, searchTerm, sortBy, sortOrder]);

  const getCompletionStats = () => {
    const completed = courses.filter(course => course.progress === 100).length;
    const inProgress = courses.filter(course => course.progress > 0 && course.progress < 100).length;
    const notStarted = courses.filter(course => course.progress === 0).length;
    
    return { completed, inProgress, notStarted, total: courses.length };
  };

  const stats = getCompletionStats();

  // Dynamic classes based on theme
  const titleClass = theme === 'dark' ? 'text-white' : 'text-gray-800';
  const subTitleClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const statTextClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const searchBgClass = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const searchTextClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const searchPlaceholderClass = theme === 'dark' ? 'placeholder-gray-500' : 'placeholder-gray-400';
  const filterBgClass = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const filterActiveClass = theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-indigo-50 text-indigo-600';
  const filterInactiveClass = theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100';

  return (
    <div className="space-y-8">
      <div>
        <h1 className={`text-2xl font-bold ${titleClass}`}>My Courses</h1>
        <p className={subTitleClass}>Manage and continue your learning journey</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <CardBase className="p-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 ${theme === 'dark' ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-600'} rounded-lg`}>
              <BookOpen size={20} />
            </div>
            <div>
              <p className={statTextClass}>Total Courses</p>
              <p className={`text-2xl font-bold ${titleClass}`}>{stats.total}</p>
            </div>
          </div>
        </CardBase>
        
        <CardBase className="p-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 ${theme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600'} rounded-lg`}>
              <CheckCircle size={20} />
            </div>
            <div>
              <p className={statTextClass}>Completed</p>
              <p className={`text-2xl font-bold ${titleClass}`}>{stats.completed}</p>
            </div>
          </div>
        </CardBase>
        
        <CardBase className="p-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 ${theme === 'dark' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-600'} rounded-lg`}>
              <BookOpen size={20} />
            </div>
            <div>
              <p className={statTextClass}>In Progress</p>
              <p className={`text-2xl font-bold ${titleClass}`}>{stats.inProgress}</p>
            </div>
          </div>
        </CardBase>
        
        <CardBase className="p-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} rounded-lg`}>
              <BookOpen size={20} />
            </div>
            <div>
              <p className={statTextClass}>Not Started</p>
              <p className={`text-2xl font-bold ${titleClass}`}>{stats.notStarted}</p>
            </div>
          </div>
        </CardBase>
      </div>
      
      {/* Search and Filter */}
      <div>
        <div className="flex flex-wrap gap-4 mb-6">
          <div className={`flex items-center px-4 py-2 border rounded-lg w-full md:w-auto flex-1 md:flex-none ${searchBgClass}`}>
            <Search size={18} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-400'} />
            <input
              type="text"
              placeholder="Search your courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`ml-2 outline-none bg-transparent w-full ${searchTextClass} ${searchPlaceholderClass}`}
            />
          </div>
          
          <div className="flex">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-l-lg ${filterStatus === 'all' ? filterActiveClass : filterInactiveClass} ${filterBgClass}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('in-progress')}
              className={`px-4 py-2 ${filterStatus === 'in-progress' ? filterActiveClass : filterInactiveClass} ${filterBgClass}`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-4 py-2 ${filterStatus === 'completed' ? filterActiveClass : filterInactiveClass} ${filterBgClass}`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilterStatus('not-started')}
              className={`px-4 py-2 rounded-r-lg ${filterStatus === 'not-started' ? filterActiveClass : filterInactiveClass} ${filterBgClass}`}
            >
              Not Started
            </button>
          </div>
          
          <div className="ml-auto flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? filterActiveClass : filterInactiveClass} ${filterBgClass}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? filterActiveClass : filterInactiveClass} ${filterBgClass}`}
            >
              <List size={18} />
            </button>
            
            <select 
              value={`${sortBy}-${sortOrder}`} 
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
              }}
              className={`ml-2 p-2 rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-gray-300' : 'border-gray-200 bg-white text-gray-700'}`}
            >
              <option value="title-asc">Sort by Name ↑</option>
              <option value="title-desc">Sort by Name ↓</option>
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="progress-desc">Highest Progress</option>
              <option value="progress-asc">Lowest Progress</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Courses Grid/List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className={`mt-2 ${subTitleClass}`}>Loading your courses...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <CardBase className="py-12 text-center">
          <p className={`text-lg ${titleClass}`}>No courses found</p>
          <p className={subTitleClass}>Try adjusting your search or filters</p>
        </CardBase>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
        }>
          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
} 