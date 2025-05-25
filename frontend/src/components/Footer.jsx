// src/components/Footer.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaApple,
  FaGooglePlay,
} from "react-icons/fa";

export default function Footer() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <footer className={`
      bg-gradient-to-b from-indigo-600 via-indigo-800 to-gray-900 
      text-white py-12 px-6
    `}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Socials + Branding */}
        <div>
          <h2 className="text-xl font-semibold mb-4">{t("footer.followUs")}</h2>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-500">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-pink-500">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-blue-400">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-blue-600">
              <FaLinkedinIn />
            </a>
          </div>
          <div className="mt-6 space-y-3 w-60">
            <button className={`w-full flex items-center justify-center px-4 py-3 ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-800 hover:bg-black'} rounded-lg`}>
              <FaApple className="text-2xl mr-3" />
              <div className="text-left">
                <p className="text-xs leading-none">{t("footer.downloadOn")}</p>
                <p className="text-sm font-semibold leading-none">{t("footer.appStore")}</p>
              </div>
            </button>
            <button className={`w-full flex items-center justify-center px-4 py-3 ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-800 hover:bg-black'} rounded-lg`}>
              <FaGooglePlay className="text-2xl mr-3" />
              <div className="text-left">
                <p className="text-xs leading-none">{t("footer.getItOn")}</p>
                <p className="text-sm font-semibold leading-none">{t("footer.googlePlay")}</p>
              </div>
            </button>
          </div>
        </div>

        {/* Newsletter / form */}
        <div className="col-span-1 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">{t("footer.stayInformed")}</h2>
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder={t("footer.namePlaceholder")}
              className={`p-3 rounded-lg ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 text-white focus:ring-indigo-500' 
                  : 'bg-gray-100 border-gray-300 text-gray-800 focus:ring-blue-500'
              } border focus:outline-none focus:ring-2`}
            />
            <input
              type="email"
              placeholder={t("footer.emailPlaceholder")}
              className={`p-3 rounded-lg ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 text-white focus:ring-indigo-500' 
                  : 'bg-gray-100 border-gray-300 text-gray-800 focus:ring-blue-500'
              } border focus:outline-none focus:ring-2`}
            />

            <div className="flex items-start sm:col-span-2">
              <input type="checkbox" className={`mr-2 mt-1 ${
                theme === 'dark' ? 'accent-indigo-500' : ''
              }`} />
              <p className="text-sm">
                {t("footer.acceptTerms")}{" "}
                <a href="#" className={`underline ${
                  theme === 'dark' ? 'hover:text-indigo-400' : 'hover:text-blue-400'
                }`}>
                  {t("footer.termsAndConditions")}
                </a>
              </p>
            </div>
            <button
              type="submit"
              className={`${
                theme === 'dark' 
                  ? 'bg-indigo-600 hover:bg-indigo-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } transition text-white font-semibold py-2 px-4 rounded-lg sm:col-span-2`}
            >
              {t("footer.subscribe")}
            </button>
          </form>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center mt-10 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} E-Learn. {t("footer.allRightsReserved")}
      </div>
    </footer>
  );
}
