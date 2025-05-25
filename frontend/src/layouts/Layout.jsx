// layouts/Layout.jsx
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Menu } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { theme } = useTheme();

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} relative transition-colors duration-300`}>
      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full transition-all duration-300 z-20
          ${isSidebarOpen ? "w-64" : "w-0"}
        `}
      >
        <Sidebar isOpen={isSidebarOpen} />
      </div>

      {/* Hamburger */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 left-4 z-50 p-2 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-full shadow md:top-6 md:left-6 transition-colors duration-300`}
      >
        <Menu size={24} />
      </button>

      {/* Contenu principal animé horizontalement et verticalement */}
      <div
        className={`
          transition-all duration-300 flex-1 h-full overflow-auto
          ${isSidebarOpen ? "ml-64 mt-0" : "ml-0 mt-12"}
          ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}
        `}
      >
        <main className={`p-6 min-h-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
