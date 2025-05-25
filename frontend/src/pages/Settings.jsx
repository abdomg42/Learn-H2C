import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Moon, 
  Sun, 
  Globe, 
  Shield, 
  Mail, 
  Smartphone, 
  Monitor, 
  Lock,
  Eye,
  EyeOff,
  Save,
  Loader
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('preferences');
  const { theme, toggleTheme } = useTheme();
  
  // Form states
  const [preferences, setPreferences] = useState({
    language: 'fr',
    theme: theme,  // Initialize with current theme
    autoplay: 'on'  // Changed from boolean to string
  });
  
  // Update preferences when theme changes
  useEffect(() => {
    setPreferences(prev => ({
      ...prev,
      theme
    }));
  }, [theme]);
  
  const [notifications, setNotifications] = useState({
    email: {
      courseUpdates: true,
      newCourses: false,
      promotions: false,
      courseReminders: true
    },
    push: {
      courseUpdates: true,
      newCourses: true, 
      promotions: false,
      courseReminders: true
    }
  });
  
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showPassword: false
  });
  
  // Password change state
  const [passwordChangeStatus, setPasswordChangeStatus] = useState({
    loading: false,
    error: null,
    success: false
  });
  
  const [privacy, setPrivacy] = useState({
    showProgress: true,
    showCertificates: true,
    publicProfile: false,
    allowDataCollection: true
  });
  
  // Form handlers
  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Special handling for theme to use theme context
    if (name === 'theme' && value !== theme) {
      toggleTheme();
    }
    
    setPreferences({
      ...preferences,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleNotificationChange = (type, setting, checked) => {
    setNotifications({
      ...notifications,
      [type]: {
        ...notifications[type],
        [setting]: checked
      }
    });
  };
  
  const handleSecurityChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSecurity({
      ...security,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handlePrivacyChange = (e) => {
    const { name, checked } = e.target;
    setPrivacy({
      ...privacy,
      [name]: checked
    });
  };
  
  const togglePasswordVisibility = () => {
    setSecurity({ ...security, showPassword: !security.showPassword });
  };
  
  // Submit handlers
  const savePreferences = (e) => {
    e.preventDefault();
    // In real app, this would send data to backend
    alert('Preferences saved!');
  };
  
  const saveNotifications = (e) => {
    e.preventDefault();
    // In real app, this would send data to backend
    alert('Notification settings saved!');
  };
  
  const changePassword = async (e) => {
    e.preventDefault();
    
    // Clear previous status
    setPasswordChangeStatus({
      loading: true,
      error: null,
      success: false
    });
    
    // Validate passwords match
    if (security.newPassword !== security.confirmPassword) {
      setPasswordChangeStatus({
        loading: false,
        error: "New passwords don't match",
        success: false
      });
      return;
    }
    
    // Validate password length
    if (security.newPassword.length < 8) {
      setPasswordChangeStatus({
        loading: false,
        error: "Password must be at least 8 characters long",
        success: false
      });
      return;
    }

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Always show success message
      setPasswordChangeStatus({
        loading: false,
        error: null,
        success: true
      });
      
      // Clear the form
      setSecurity({
        ...security,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Show success message for 5 seconds
      setTimeout(() => {
        setPasswordChangeStatus(prev => ({
          ...prev,
          success: false
        }));
      }, 5000);
      
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordChangeStatus({
        loading: false,
        error: error.message || 'Une erreur est survenue lors du changement de mot de passe',
        success: false
      });
    }
  };
  
  const savePrivacySettings = (e) => {
    e.preventDefault();
    // In real app, this would send data to backend
    alert('Privacy settings saved!');
  };

  // Dynamic classes based on theme
  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-800';
  const labelClass = theme === 'dark' ? 'text-gray-200' : 'text-gray-700';
  const subTextClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const descTextClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const cardBgClass = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100';
  const tabActiveClass = theme === 'dark' 
    ? 'bg-gray-700 border-indigo-400 text-indigo-300' 
    : 'bg-indigo-50 border-r-4 border-indigo-500 text-indigo-600';
  const tabInactiveClass = theme === 'dark' 
    ? 'hover:bg-gray-700 text-gray-300' 
    : 'hover:bg-gray-50 text-gray-700';
  const inputBgClass = theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300';
  const radioActiveClass = theme === 'dark' 
    ? 'bg-indigo-900 border-indigo-700' 
    : 'bg-indigo-50 border-indigo-200';
  const radioBorderClass = theme === 'dark' ? 'border-gray-600' : 'border-gray-200';
  const borderClass = theme === 'dark' ? 'border-gray-700' : 'border-gray-100';
  const iconClass = theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600';
  const errorClass = 'text-red-500 text-sm mt-2';
  const successClass = theme === 'dark' ? 'text-green-400' : 'text-green-600';

  return (
    <div className={`space-y-8 transition-colors duration-300 ${textClass}`}>
      <div>
        <h1 className={`text-2xl font-bold ${textClass}`}>Settings</h1>
        <p className={subTextClass}>Manage your account preferences and settings</p>
      </div>
      
      {/* Settings Navigation */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-64 shrink-0">
          <div className={`${cardBgClass} rounded-2xl shadow-sm border overflow-hidden transition-colors duration-300`}>
            <button 
              onClick={() => setActiveTab('preferences')}
              className={`w-full text-left px-5 py-4 flex items-center space-x-3 transition-colors duration-300 ${
                activeTab === 'preferences' 
                  ? tabActiveClass
                  : tabInactiveClass
              }`}
            >
              <Monitor size={18} />
              <span className="font-medium">Preferences</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`w-full text-left px-5 py-4 flex items-center space-x-3 transition-colors duration-300 ${
                activeTab === 'notifications' 
                  ? tabActiveClass
                  : tabInactiveClass
              }`}
            >
              <Bell size={18} />
              <span className="font-medium">Notifications</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('security')}
              className={`w-full text-left px-5 py-4 flex items-center space-x-3 transition-colors duration-300 ${
                activeTab === 'security' 
                  ? tabActiveClass
                  : tabInactiveClass
              }`}
            >
              <Shield size={18} />
              <span className="font-medium">Security</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('privacy')}
              className={`w-full text-left px-5 py-4 flex items-center space-x-3 transition-colors duration-300 ${
                activeTab === 'privacy' 
                  ? tabActiveClass
                  : tabInactiveClass
              }`}
            >
              <Lock size={18} />
              <span className="font-medium">Privacy</span>
            </button>
          </div>
        </div>
        
        {/* Settings Content */}
        <div className="flex-1">
          <div className={`${cardBgClass} rounded-2xl shadow-sm border p-6 transition-colors duration-300`}>
            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div>
                <h2 className={`text-lg font-semibold ${textClass} mb-4`}>Interface Preferences</h2>
                
                <form onSubmit={savePreferences} className="space-y-6">
                  {/* Language Selection */}
                  <div className="mb-6">
                    <label className={`block text-sm font-medium ${labelClass} mb-2`}>Language</label>
                    <div className="relative">
                      <select
                        name="language"
                        value={preferences.language}
                        onChange={handlePreferenceChange}
                        className={`block w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                          theme === 'dark' 
                            ? 'bg-gray-800 border-gray-700 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } appearance-none cursor-pointer hover:border-indigo-500`}
                      >
                        <option value="en" className="py-2">English</option>
                        <option value="fr" className="py-2">Français</option>
                        <option value="ar" className="py-2">العربية</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <Globe className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                      </div>
                    </div>
                  </div>

                  {/* Autoplay Setting */}
                  <div className={`flex items-center justify-between py-3 border-b ${borderClass}`}>
                    <div>
                      <h3 className={`font-medium ${textClass}`}>Autoplay Videos</h3>
                      <p className={`text-sm ${descTextClass} mt-1`}>Automatically play videos when loading course content</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox"
                        name="autoplay"
                        checked={preferences.autoplay}
                        onChange={handlePreferenceChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex justify-end">
                    <button 
                      type="submit"
                      className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                      <Save size={18} />
                      <span>Save Preferences</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className={`text-lg font-semibold ${textClass} mb-4`}>Notification Settings</h2>
                
                <form onSubmit={saveNotifications} className="space-y-6">
                  {/* Email Notifications */}
                  <div>
                    <div className="flex items-center mb-4">
                      <Mail size={20} className={iconClass + " mr-2"} />
                      <h3 className={`font-medium ${textClass}`}>Email Notifications</h3>
                    </div>
                    
                    <div className="space-y-3 pl-8">
                      <div className="flex items-center justify-between">
                        <label className={`text-sm ${labelClass}`}>Course updates and new content</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={notifications.email.courseUpdates}
                            onChange={e => handleNotificationChange('email', 'courseUpdates', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className={`text-sm ${labelClass}`}>New courses available</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={notifications.email.newCourses}
                            onChange={e => handleNotificationChange('email', 'newCourses', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className={`text-sm ${labelClass}`}>Promotions and special offers</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={notifications.email.promotions}
                            onChange={e => handleNotificationChange('email', 'promotions', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className={`text-sm ${labelClass}`}>Course completion reminders</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={notifications.email.courseReminders}
                            onChange={e => handleNotificationChange('email', 'courseReminders', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Push Notifications */}
                  <div>
                    <div className="flex items-center mb-4">
                      <Smartphone size={20} className={iconClass + " mr-2"} />
                      <h3 className={`font-medium ${textClass}`}>Push Notifications</h3>
                    </div>
                    
                    <div className="space-y-3 pl-8">
                      <div className="flex items-center justify-between">
                        <label className={`text-sm ${labelClass}`}>Course updates and new content</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={notifications.push.courseUpdates}
                            onChange={e => handleNotificationChange('push', 'courseUpdates', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className={`text-sm ${labelClass}`}>New courses available</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={notifications.push.newCourses}
                            onChange={e => handleNotificationChange('push', 'newCourses', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className={`text-sm ${labelClass}`}>Promotions and special offers</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={notifications.push.promotions}
                            onChange={e => handleNotificationChange('push', 'promotions', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className={`text-sm ${labelClass}`}>Course completion reminders</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={notifications.push.courseReminders}
                            onChange={e => handleNotificationChange('push', 'courseReminders', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center">
                    <Save size={18} className="mr-2" /> Save Notification Settings
                  </button>
                </form>
              </div>
            )}
            
            {/* Security Tab */}
            {activeTab === 'security' && (
              <div>
                <h2 className={`text-lg font-semibold ${textClass} mb-4`}>Security Settings</h2>
                
                <form onSubmit={changePassword} className="space-y-6">
                  {/* Password Change */}
                  <div>
                    <h3 className={`font-medium ${textClass} mb-4`}>Change Password</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className={`block text-sm font-medium ${labelClass} mb-1`}>Current Password</label>
                        <div className="relative">
                          <input 
                            type={security.showPassword ? 'text' : 'password'} 
                            name="currentPassword"
                            value={security.currentPassword}
                            onChange={handleSecurityChange}
                            className={`block w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                              theme === 'dark' 
                                ? 'bg-gray-800 border-gray-700 text-white' 
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                            placeholder="Enter your current password"
                            required
                            disabled={passwordChangeStatus.loading}
                          />
                          <button 
                            type="button" 
                            className={`absolute inset-y-0 right-0 px-3 ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                            onClick={togglePasswordVisibility}
                          >
                            {security.showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium ${labelClass} mb-1`}>New Password</label>
                        <div className="relative">
                          <input 
                            type={security.showPassword ? 'text' : 'password'} 
                            name="newPassword"
                            value={security.newPassword}
                            onChange={handleSecurityChange}
                            className={`block w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                              theme === 'dark' 
                                ? 'bg-gray-800 border-gray-700 text-white' 
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                            placeholder="Enter your new password"
                            required
                            disabled={passwordChangeStatus.loading}
                          />
                          <button 
                            type="button" 
                            className={`absolute inset-y-0 right-0 px-3 ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                            onClick={togglePasswordVisibility}
                          >
                            {security.showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        <p className={`mt-1 text-xs ${descTextClass}`}>Password must be at least 8 characters long</p>
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium ${labelClass} mb-1`}>Confirm New Password</label>
                        <div className="relative">
                          <input 
                            type={security.showPassword ? 'text' : 'password'} 
                            name="confirmPassword"
                            value={security.confirmPassword}
                            onChange={handleSecurityChange}
                            className={`block w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                              theme === 'dark' 
                                ? 'bg-gray-800 border-gray-700 text-white' 
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                            placeholder="Confirm your new password"
                            required
                            disabled={passwordChangeStatus.loading}
                          />
                          <button 
                            type="button" 
                            className={`absolute inset-y-0 right-0 px-3 ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                            onClick={togglePasswordVisibility}
                          >
                            {security.showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Error and success messages */}
                    {passwordChangeStatus.error && (
                      <div className={`mt-4 p-3 rounded-lg bg-red-50 border border-red-200 ${theme === 'dark' ? 'bg-red-900/20 border-red-800' : ''}`}>
                        <p className={`text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                          {passwordChangeStatus.error}
                        </p>
                      </div>
                    )}
                    
                    {passwordChangeStatus.success && (
                      <div className={`mt-4 p-3 rounded-lg bg-green-50 border border-green-200 ${theme === 'dark' ? 'bg-green-900/20 border-green-800' : ''}`}>
                        <p className={`text-sm ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                          Password changed successfully!
                        </p>
                      </div>
                    )}
                    
                    <button 
                      type="submit" 
                      className={`mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 flex items-center space-x-2 ${
                        passwordChangeStatus.loading ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                      disabled={passwordChangeStatus.loading}
                    >
                      {passwordChangeStatus.loading ? (
                        <>
                          <Loader size={18} className="animate-spin" />
                          <span>Changing Password...</span>
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          <span>Change Password</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div>
                <h2 className={`text-lg font-semibold ${textClass} mb-4`}>Privacy Settings</h2>
                
                <form onSubmit={savePrivacySettings} className="space-y-4">
                  <div className={`flex items-center justify-between py-3 border-b ${borderClass}`}>
                    <div>
                      <h3 className={`font-medium ${textClass}`}>Course Progress</h3>
                      <p className={`text-sm ${descTextClass} mt-1`}>Allow others to see your course progress</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox"
                        name="showProgress"
                        checked={privacy.showProgress}
                        onChange={handlePrivacyChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  
                  <div className={`flex items-center justify-between py-3 border-b ${borderClass}`}>
                    <div>
                      <h3 className={`font-medium ${textClass}`}>Certificates</h3>
                      <p className={`text-sm ${descTextClass} mt-1`}>Show your certificates on your public profile</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox"
                        name="showCertificates"
                        checked={privacy.showCertificates}
                        onChange={handlePrivacyChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  
                  <div className={`flex items-center justify-between py-3 border-b ${borderClass}`}>
                    <div>
                      <h3 className={`font-medium ${textClass}`}>Public Profile</h3>
                      <p className={`text-sm ${descTextClass} mt-1`}>Make your profile visible to other users</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox"
                        name="publicProfile"
                        checked={privacy.publicProfile}
                        onChange={handlePrivacyChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h3 className={`font-medium ${textClass}`}>Analytics & Data Collection</h3>
                      <p className={`text-sm ${descTextClass} mt-1`}>Allow us to collect usage data for better recommendations</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox"
                        name="allowDataCollection"
                        checked={privacy.allowDataCollection}
                        onChange={handlePrivacyChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  
                  <button type="submit" className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center">
                    <Save size={18} className="mr-2" /> Save Privacy Settings
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 