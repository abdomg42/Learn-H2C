import React, { useState, useEffect } from 'react';
import { User, Mail, Camera, Save, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import CardBase from '../components/CardBase';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    bio: ''
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    try {
      // Create a preview URL for the image (frontend only)
      const imageUrl = URL.createObjectURL(file);
      setProfilePicture(imageUrl);
      setUser(prevUser => ({
        ...prevUser,
        profile: {
          ...prevUser.profile,
          profile_picture: imageUrl
        }
      }));
      
      setError('');
    } catch (error) {
      console.error('Error handling image:', error);
      setError('Failed to process image. Please try again.');
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/users/profile/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        timeout: 5000 // 5 second timeout
      });
      setUser(response.data);
      setFormData({
        first_name: response.data.first_name || response.data.username || '',
        last_name: response.data.last_name || '',
        email: response.data.email || '',
        bio: response.data.profile?.bio || ''
      });
      if (response.data.profile?.profile_picture) {
        setProfilePicture(response.data.profile.profile_picture);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
        setError('Cannot connect to the server. Please make sure the backend server is running.');
      } else if (error.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        navigate('/login');
      } else {
        setError('Failed to load profile data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Update local state only (frontend)
      setUser({
        ...user,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        profile: {
          ...user.profile,
          bio: formData.bio
        }
      });
      
      setIsEditing(false);
      
      // Show success message
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    }
  };

  const cancelEdit = () => {
    // Reset form data to current user data
    setFormData({
      first_name: user.first_name || user.username || '',
      last_name: user.last_name || '',
      email: user.email || '',
      bio: user.profile?.bio || ''
    });
    setIsEditing(false);
  };

  // Dynamic classes based on theme
  const titleClass = theme === 'dark' ? 'text-white' : 'text-gray-800';
  const headingClass = theme === 'dark' ? 'text-white' : 'text-gray-800';
  const labelClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const dividerClass = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200';
  const spanBgClass = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100';
  const spanTextClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const cancelBtnClass = theme === 'dark' 
    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
    : 'bg-gray-200 text-gray-700 hover:bg-gray-300';

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">Error Loading Profile</h2>
          <p className="text-gray-400 mb-4">{error || 'Failed to load profile data'}</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className={`text-2xl font-bold ${titleClass}`}>My Profile</h1>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Edit Profile
          </button>
        )}
      </div>
      
      <CardBase className="overflow-hidden p-0">
        {/* Profile Header */}
        <div className="relative h-48 bg-gradient-to-r from-indigo-500 to-purple-600">
          <div className="absolute -bottom-16 left-8 bg-white p-1 rounded-full shadow-lg">
            <div className="relative">
              <img 
                src={profilePicture || `https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=random`}
                alt={user?.username || 'User'}
                className="w-32 h-32 rounded-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=random`;
                }}
              />
              <label className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition cursor-pointer">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Camera size={16} />
              </label>
            </div>
          </div>
        </div>
        
        {/* Profile Content */}
        <div className="pt-20 px-8 pb-8">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-6 md:col-span-2">
                <div className="flex items-center justify-between">
                  <h2 className={`text-lg font-semibold ${headingClass}`}>Personal Information</h2>
                  {isEditing && (
                    <div className="flex space-x-2">
                      <button 
                        type="submit"
                        className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
                      >
                        <Save size={16} className="mr-1" /> Save
                      </button>
                      <button 
                        type="button"
                        onClick={cancelEdit}
                        className={`flex items-center px-3 py-1.5 ${cancelBtnClass} rounded-lg text-sm transition`}
                      >
                        <X size={16} className="mr-1" /> Cancel
                      </button>
                    </div>
                  )}
                </div>
                <div className={`h-px ${dividerClass}`}></div>
              </div>
              
              {/* First Name */}
              <div>
                <label className={`block text-sm font-medium ${labelClass} mb-1`}>First Name</label>
                {isEditing ? (
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <span className={`px-3 py-2 ${spanBgClass} ${spanTextClass}`}>
                      <User size={18} />
                    </span>
                    <input 
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className={`block w-full px-3 py-2 border-0 focus:ring-0 focus:outline-none ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
                      placeholder="Enter your first name"
                    />
                  </div>
                ) : (
                  <div className="flex items-center">
                    <User size={18} className="text-indigo-600 mr-2" />
                    <span className={headingClass}>{user?.first_name || 'Not set'}</span>
                  </div>
                )}
              </div>
              
              {/* Last Name */}
              <div>
                <label className={`block text-sm font-medium ${labelClass} mb-1`}>Last Name</label>
                {isEditing ? (
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <span className={`px-3 py-2 ${spanBgClass} ${spanTextClass}`}>
                      <User size={18} />
                    </span>
                    <input 
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className={`block w-full px-3 py-2 border-0 focus:ring-0 focus:outline-none ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
                      placeholder="Enter your last name"
                    />
                  </div>
                ) : (
                  <div className="flex items-center">
                    <User size={18} className="text-indigo-600 mr-2" />
                    <span className={headingClass}>{user?.last_name || 'Not set'}</span>
                  </div>
                )}
              </div>
              
              {/* Email */}
              <div className="md:col-span-2">
                <label className={`block text-sm font-medium ${labelClass} mb-1`}>Email</label>
                <div className="flex items-center">
                  <Mail size={18} className="text-indigo-600 mr-2" />
                  <span className={headingClass}>{user?.email || 'Not set'}</span>
                </div>
              </div>
              
              {/* Bio Field */}
              <div className="md:col-span-2">
                <label className={`block text-sm font-medium ${labelClass} mb-1`}>Bio</label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
                    }`}
                    rows="4"
                    placeholder="Tell us about yourself..."
                    maxLength={500}
                  />
                ) : (
                  <div className={`p-4 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                  }`}>
                    <p className={`${headingClass} whitespace-pre-wrap`}>
                      {user?.profile?.bio || 'No bio added yet'}
                    </p>
                  </div>
                )}
                {isEditing && (
                  <p className={`mt-1 text-sm ${spanTextClass}`}>
                    {formData.bio.length}/500 characters
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>
      </CardBase>
    </div>
  );
}