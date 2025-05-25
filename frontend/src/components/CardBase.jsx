import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function CardBase({ children, className = '', ...props }) {
  const { theme } = useTheme();
  
  const baseClasses = theme === 'dark' 
    ? 'bg-gray-800 border-gray-700 text-white' 
    : 'bg-white border-gray-100 text-gray-800';
    
  return (
    <div 
      className={`rounded-2xl border shadow-sm p-6 transition-colors duration-300 ${baseClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
} 