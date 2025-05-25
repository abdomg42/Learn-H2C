import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full transition-colors duration-300 ${className} ${
        theme === 'dark' 
          ? 'bg-gray-700 text-yellow-200 hover:bg-gray-600' 
          : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
      }`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun size={20} className="animate-pulse" />
      ) : (
        <Moon size={20} />
      )}
    </button>
  );
} 