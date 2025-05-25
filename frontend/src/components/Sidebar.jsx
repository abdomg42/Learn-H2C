import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  BookOpen,
  Settings,
  LogOut,
  BookOpenCheck,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";

export default function Sidebar({ isOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  
 const handleLogout = () => {
    // Clear all auth-related data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.clear();
    // Redirect to login page
    navigate('/login');
  };

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/profile", label: "My Profile", icon: <User size={20} /> },
    { to: "/my-courses", label: "My Courses", icon: <BookOpen size={20} /> },
    { to: "/settings", label: "Settings", icon: <Settings size={20} /> },
    { 
      onClick: handleLogout, 
      label: "Log Out", 
      icon: <LogOut size={20} />,
      isLogout: true 
    },
  ];

  return (
    <div
      className={`
        h-full bg-gradient-to-b from-indigo-600 via-indigo-800 to-gray-900 text-white 
        transition-all duration-300 overflow-hidden sidebar-btn
        ${isOpen ? "w-64 px-4 py-6" : "w-0"}
      `}
    >
      {isOpen && (
        <div>
          {/* Logo */}
          <div className="h-12 mb-8 p-4 flex items-center justify-center">
            <h1 className="text-2xl font-bold text-white">Learn-H2C</h1>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`sidebar-btn flex items-center space-x-2 px-4 py-3 my-4 rounded-lg transition-all ${
                  location.pathname === link.to
                    ? "bg-white/10 text-white font-medium"
                    : "hover:bg-white/5 text-white/80 hover:text-white"
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
       
          
          {/* Theme Toggle */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-xl">
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-medium text-white">
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </span>
                <ThemeToggle className="!bg-white/20 !text-white hover:!bg-white/30" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
