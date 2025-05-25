// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { BookOpen, Users, Award, Clock, ArrowRight, Globe } from "lucide-react";
import Marquee from 'react-fast-marquee';
import ENSAM from '../assets/ENSAM.png'
import ENCG from '../assets/ENCG.png'
import ENSAD from '../assets/ENSAD.png'
import ENSET from '../assets/ENSET.png'
import EST from '../assets/EST.png'
import FST from '../assets/FST.png'
import FMPC from '../assets/FMPC.png'
import FSJES from '../assets/FSJES.png'
import ENS from '../assets/ENS.png'
import Student from '../assets/student.png';
import universite from '../assets/universite.png';
import etud1 from '../assets/etud1.png'
import etud2 from '../assets/etud2.png'
import etud3 from '../assets/etud3.png'
const logos = [ENSAM, ENCG, ENSAD, ENSET, EST, FST, FMPC, FSJES, ENS];

const dummyCourses = [
  {
    badge: "Nouveau",
    title: "Google Data Analytics",
    subtitle: "Professional Certificate",
    type: "Certificat",
    image: "google-data-analytics-course-2025.jpg",
  },
  {
    badge: "Gratuit",
    title: "Introduction to Statistics",
    subtitle: "Stanford University",
    type: "Cours",
    image: "statistics.png",
  },
  {
    badge: "Populaire",
    title: "Meta Social Media Marketing",
    subtitle: "Professional Certificate",
    type: "Certificat",
    image: "meta-social.png",
  },
];

export default function Landing() {
  const { t, i18n } = useTranslation();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsLanguageMenuOpen(false);
  };

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isLanguageMenuOpen && !event.target.closest('.language-selector')) {
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isLanguageMenuOpen]);

  const features = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Diverse Course Catalog",
      description: "Access thousands of courses across various disciplines"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Expert Instructors",
      description: "Learn from industry professionals and experienced educators"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Certification",
      description: "Earn recognized certificates upon course completion"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Learn at Your Pace",
      description: "Study anytime, anywhere with flexible scheduling"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Left Column - Text Content */}
            <div className="w-full md:w-1/2 text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t('landing.hero.title')}{" "}
                <span className="bg-gradient-to-r from-blue-600 to-violet-600 text-transparent bg-clip-text font-extrabold animate-pulse hover:scale-105 transition-transform duration-300">
                  {t('landing.hero.brand')}
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                {t('landing.hero.description')}
              </p>
              <div className="flex flex-row gap-4 items-center">
                <Link
                  to="/signup"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
                >
                  {t('landing.hero.getStarted')}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-blue-600 bg-white border border-blue-600 hover:bg-blue-50 transition-colors duration-200"
                >
                  {t('landing.hero.signIn')}
                </Link>
              </div>
            </div>
            
            {/* Right Column - Images */}
            <div className="w-full md:w-1/2 mt-8 md:mt-0 relative">
              <img
                src={Student}
                alt={t('landing.hero.studentImageAlt')}
                className="w-full max-w-md h-auto rounded-lg shadow-lg mx-auto"
              />
            </div>
          </div>
        </div>
      </div>

      

      {/* Partnership Section */}
      <div id="partnership" className="w-full container mx-auto py-20 overflow-hidden flex sm:flex-row sm:items-center  mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="w-[300px] shrink-0 px-8 text-gray-600 border-l-4 border-blue-500 bg-white justify-center items-center py-8 mt-6 z-10 sm:text-base text-xl font-semibold sm:text-left mb-8 sm:mb-0">
          {t('landing.partnership.title')}
        </div>
        
        <Marquee direction="right" speed={50} delay={2}>
          {logos.map((src, index) => (
            <div key={index} className="flex h-12 w-auto px-8 gap-8">
              <img src={src} alt={`logo-${index + 1}`} />
            </div>
          ))}
        </Marquee>
      </div>
      {/* Section À propos */}
      <div id="about" className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Colonne gauche - Image */}
            <div className="w-full md:w-1/2 p-8">
              <img
                src={universite}
                alt={t('landing.about.campusImageAlt')}
                className="w-full max-w-lg h-auto rounded-lg px-12 mx-15 shadow-xl mx-auto transform hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Colonne droite - Texte */}
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('landing.about.title')}</h2>
              <div className="space-y-4 text-gray-600">
                <p>{t('landing.about.paragraph1')}</p>
                <p>{t('landing.about.paragraph2')}</p>
                <p>{t('landing.about.paragraph3')}</p>
                <p>{t('landing.about.paragraph4')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Student Testimonials Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {t('landing.testimonials.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <img src={etud1} alt="Amine" className="w-12 h-12 rounded-full object-cover" />
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">{t('landing.testimonials.student1.name')}</h3>
                  <p className="text-sm text-gray-600">{t('landing.testimonials.student1.school')}</p>
                </div>
              </div>
              <p className="text-gray-600">{t('landing.testimonials.student1.text')}</p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <img src={etud3} alt="Mohammed" className="w-12 h-12 rounded-full object-cover" />
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">{t('landing.testimonials.student2.name')}</h3>
                  <p className="text-sm text-gray-600">{t('landing.testimonials.student2.school')}</p>
                </div>
              </div>
              <p className="text-gray-600">{t('landing.testimonials.student2.text')}</p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <img src={etud2} alt="Sanaa" className="w-12 h-12 rounded-full object-cover" />
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">{t('landing.testimonials.student3.name')}</h3>
                  <p className="text-sm text-gray-600">{t('landing.testimonials.student3.school')}</p>
                </div>
              </div>
              <p className="text-gray-600">{t('landing.testimonials.student3.text')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
