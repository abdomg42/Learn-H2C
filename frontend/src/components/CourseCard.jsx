import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, CheckCircle } from 'lucide-react';
import CardBase from './CardBase';
import { useTheme } from '../context/ThemeContext';

export default function CourseCard({ course }) {
  const { theme } = useTheme();
  const isCompleted = course.progress === 100;
  
  // Determine button style and text based on progress
  const getButtonProps = () => {
    if (isCompleted) {
      return {
        text: 'Revoir',
        icon: <CheckCircle size={16} className="mr-1" />,
        className: theme === 'dark' 
          ? 'bg-green-800 hover:bg-green-700 text-green-200' 
          : 'bg-green-100 hover:bg-green-200 text-green-700'
      };
    } else if (course.progress > 0) {
      return {
        text: 'Continuer',
        icon: <PlayCircle size={16} className="mr-1" />,
        className: theme === 'dark'
          ? 'bg-indigo-800 hover:bg-indigo-700 text-indigo-200'
          : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
      };
    } else {
      return {
        text: 'Commencer',
        icon: <PlayCircle size={16} className="mr-1" />,
        className: 'bg-indigo-600 hover:bg-indigo-700 text-white'
      };
    }
  };
  
  const buttonProps = getButtonProps();
  
  const descriptionClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const progressTextClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const progressBgClass = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200';
  
  return (
    <CardBase className="p-0 overflow-hidden group hover:shadow-xl">
      <div className="relative h-40 overflow-hidden">
        <img 
          src={course.image || '/placeholder-course.jpg'} 
          alt={course.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <div className="absolute top-2 right-2 px-2 py-1 text-xs font-semibold text-white bg-indigo-600 rounded-full">
          {course.category}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold mb-1">{course.title}</h3>
        <p className={`text-sm ${descriptionClass} mb-3 line-clamp-2`}>{course.description}</p>
        
        <div className="flex justify-between items-center mb-2">
          <span className={`text-xs font-medium ${progressTextClass}`}>
            Progression: {course.progress}%
          </span>
          {isCompleted && (
            <span className={`text-xs font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-600'} flex items-center`}>
              <CheckCircle size={14} className="mr-1" /> Terminé
            </span>
          )}
        </div>
        
        <div className={`w-full ${progressBgClass} rounded-full h-1.5 mb-3`}>
          <div 
            className={`h-1.5 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-indigo-600'}`} 
            style={{ width: `${course.progress}%` }}
          />
        </div>
        
        <Link 
          to={`/my-courses/${course.id}`} 
          className={`flex items-center justify-center w-full px-3 py-2 rounded-lg text-sm font-medium transition ${buttonProps.className}`}
        >
          {buttonProps.icon}
          {buttonProps.text}
        </Link>
      </div>
    </CardBase>
  );
} 