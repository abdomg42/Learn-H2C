import React, { useState } from 'react';
import { Menu, X, Sun, Moon, Search } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('fr');
  const [searchOpen, setSearchOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <nav className="bg-gradient-to-r from-violet-600 to-indigo-600 dark:bg-gray-900 shadow-md px-6 py-4 transition-colors duration-300">
      <div className="flex items-center justify-between">
        {/* Bouton menu mobile */}
        <div className="md:hidden mr-2">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Logo */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <img src="/logo.jpg" alt="Logo" className="h-8" />
          <span className="text-lg font-semibold text-gray-800 dark:text-white">E-Learn</span>
        </div>

        {/* Barre de recherche (visible entre le logo et autres actions) */}
        <div className="flex-1 md:flex md:items-center md:space-x-4 hidden md:flex justify-center">
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            className="w-full max-w-xs px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Actions à droite (langue, recherche, etc.) */}
        <div className="flex items-center space-x-2 ml-auto">
          {/* Recherche (mobile) */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 md:hidden"
          >
            <Search size={24} />
          </button>

          {/* Select langue (toujours visible) */}
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="text-gray-600 dark:text-gray-300 bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
          >
            <option value="fr">FR</option>
            <option value="ar">AR</option>
            <option value="en">EN</option>
          </select>

          {/* Liens desktop/tablette */}
          <div className="hidden md:flex items-center space-x-4">
          <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">{t('home')}</Link>
          
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">{t('myCourses')}</a>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">{t('browse')}</a>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">{t('certificates')}</a>

            <button onClick={toggleDarkMode}>
              {darkMode ? (
                <Sun className="text-yellow-400" size={20} />
              ) : (
                <Moon className="text-gray-600 dark:text-gray-300" size={20} />
              )}
            </button>

            <button ><Link to="/login" className="text-white hover:text-blue-300">{t('signIn')}</Link></button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">{t('signUp')}</button>
          </div>
        </div>
      </div>

      {/* Barre de recherche (mobile) */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="md:hidden mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu mobile */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden mt-4 space-y-2 origin-top"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <a href="#" className="block text-gray-600 dark:text-gray-300 hover:text-blue-600">{t('home')}</a>
            <a href="#" className="block text-gray-600 dark:text-gray-300 hover:text-blue-600">{t('myCourses')}</a>
            <a href="#" className="block text-gray-600 dark:text-gray-300 hover:text-blue-600">{t('browse')}</a>
            <a href="#" className="block text-gray-600 dark:text-gray-300 hover:text-blue-600">{t('certificates')}</a>

            <div className="flex justify-between items-center pt-2">
              <button onClick={toggleDarkMode}>
                {darkMode ? (
                  <Sun className="text-yellow-400" size={20} />
                ) : (
                  <Moon className="text-gray-600 dark:text-gray-300" size={20} />
                )}
              </button>
            </div>

            <button className="block w-full text-right text-gray-600 dark:text-gray-300 hover:text-blue-600">{t('signIn')}</button>
            <button className="block w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-right">{t('signUp')}</button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
