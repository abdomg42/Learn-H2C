// NavbarPublic.jsx
import React, { useState } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";

const NavbarPublic = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('fr');
  const [searchOpen, setSearchOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <nav className="bg-gradient-to-r from-violet-600 to-indigo-600 dark:bg-gray-900 shadow-md px-6 py-4 transition-colors duration-300">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex space-x-2">
          <img src="/logo.png" alt="Logo" className="h-12 w-12" />
          <span className="flex flex-col text-lg font-bold text-gray-800 dark:text-white justify-center">Learn-H2C</span>
        </div>

        {/* Navigation Links - Centered */}
        <div className="flex items-center justify-center gap-8">
          <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors font-medium text-base">{t('navbar.home')}</Link>
          <a href="#partnership" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors font-medium text-base cursor-pointer">{t('navbar.partnership')}</a>
          <a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors font-medium text-base cursor-pointer">{t('navbar.about')}</a>
          <a href="#contact" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors font-medium text-base cursor-pointer">{t('navbar.contact')}</a>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-6">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-500 cursor-pointer font-medium text-base"
          >
            <option value="fr" className="py-2 font-medium flex items-center gap-2"> Français</option>
            <option value="ar" className="py-2 font-medium flex items-center gap-2"> العربية</option>
            <option value="en" className="py-2 font-medium flex items-center gap-2">English</option>
          </select>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="hover:text-blue hover:bg-blue-600 hover:rounded-lg font-medium text-blue-300 transition-colors font-medium">{t('navbar.signIn')}</Link>
            <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">{t('navbar.signUp')}</Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden mt-4 space-y-4 origin-top"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link to="/" className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 font-medium">{t('navbar.home')}</Link>
            <a href="#partnership" className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 font-medium cursor-pointer">{t('navbar.partnership')}</a>
            <a href="#about" className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 font-medium cursor-pointer">{t('navbar.about')}</a>
            <a href="#contact" className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 font-medium cursor-pointer">{t('navbar.contact')}</a>
            <Link to="/login" className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 font-medium">{t('navbar.signIn')}</Link>
            <Link to="/signup" className="block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">{t('navbar.signUp')}</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavbarPublic;
