import React from 'react';
import { useTheme } from '../context/ThemeContext';
import CardBase from './CardBase';

export default function DonutChart({ data }) {
  const { theme } = useTheme();
  
  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Default colors for chart sections
  const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', '#F59E0B', '#10B981'];

  // Dynamic classes based on theme
  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-800';
  const legendTextClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const subTextClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderClass = theme === 'dark' ? 'border-gray-700' : 'border-gray-100';
  const centerBgClass = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const centerTextClass = theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600';

  return (
    <CardBase className="h-full">
      <h3 className={`text-lg font-semibold ${textClass} mb-4`}>Temps par catégorie</h3>
      
      {/* Simple visual representation */}
      <div className="flex justify-center mb-6">
        <div className={`relative w-48 h-48 rounded-full overflow-hidden border-8 ${borderClass} shadow-inner`}>
          <div className={`absolute inset-0 flex items-center justify-center ${centerBgClass} rounded-full w-32 h-32 m-auto`}>
            <span className={`text-lg font-bold ${centerTextClass}`}>{total} h</span>
          </div>
          
          {/* Circular display of data */}
          <div className="flex justify-center items-center">
            {/* Each category would need real SVG for proper pie chart */}
            {/* This is just a placeholder visual */}
            <div className="w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="space-y-2 text-sm">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <span className={legendTextClass}>{item.name}</span>
            </div>
            <span className={`font-medium ${legendTextClass}`}>{item.value} h ({Math.round(item.value / total * 100)}%)</span>
          </div>
        ))}
      </div>
      
      <div className={`mt-4 text-center text-sm ${subTextClass}`}>
        Temps total: {total} heures
      </div>
    </CardBase>
  );
} 