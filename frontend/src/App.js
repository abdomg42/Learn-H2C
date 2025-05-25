import './i18n';
import React, { useState, useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate
} from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import axios from 'axios';

import Login from './pages/Login';
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import Layout from './layouts/Layout';
import Landing from './pages/Landing';
import SignUp from './pages/SignUp.jsx';
import SignUpSuccess from './pages/signup_succe.jsx';
import DDashboard from './pages/DDashboard.jsx';
import Profile from './pages/Profile.jsx';
import MyCourses from './pages/MyCourses.jsx';
import Settings from './pages/Settings.jsx';
import CoursePlayer from './pages/CoursePlayer.jsx';

// Admin route wrapper component
const AdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/users/me/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        setIsAdmin(response.data.is_staff || response.data.is_superuser);
        if (!response.data.is_staff && !response.data.is_superuser) {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return isAdmin ? children : null;
};

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <Landing /> }
    ]
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <SignUp /> },
      { path: '/signup_success', element: <SignUpSuccess /> }
    ]
  },
  {
    element: <Layout />,
    children: [
      { path: '/dashboard', element: <DDashboard /> },
      { path: '/profile', element: <Profile /> },
      {
        path: '/my-courses',
        children: [
          { index: true, element: <MyCourses /> },
          { path: ':courseId', element: <CoursePlayer /> }
        ]
      },
      { path: '/settings', element: <Settings /> }
    ]
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
