import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaHeart } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const handleAdminClick = () => {
    window.location.href = '/admin/login';
  };

  const socialLinks = [
    { icon: FaGithub, url: 'https://github.com/ydevansh' },
    { icon: FaLinkedin, url: 'https://www.linkedin.com/in/ydevansh/' },
    { icon: FaTwitter, url: 'https://x.com/yxdevansh' },
    { icon: FaEnvelope, url: 'mailto:yaduvanshidevansh3336@gmail.com' },
  ];

  return (
    <footer className="bg-primary-900/50 backdrop-blur-md border-t border-primary-500/20 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Policy Links */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-12 text-sm">
          <Link to="/privacy-policy" className="text-gray-400 hover:text-primary-500 transition-colors">
            Privacy Policy
          </Link>
          <div className="hidden md:block w-px h-4 bg-primary-500/20"></div>
          <Link to="#" className="text-gray-400 hover:text-primary-500 transition-colors">
            Terms of Service
          </Link>
          <div className="hidden md:block w-px h-4 bg-primary-500/20"></div>
          <Link to="#" className="text-gray-400 hover:text-primary-500 transition-colors">
            Refund Policy
          </Link>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-500/20 mb-8"></div>

        {/* Copyright & Credits */}
        <div className="space-y-4 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} <a onClick={handleAdminClick} className="text-primary-500 hover:text-primary-400 transition-colors font-semibold cursor-pointer">Devansh Yadav</a>. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Built with <FaHeart className="inline text-red-500 mx-1" /> using React, Vite, Tailwind CSS & Node.js
          </p>
          <p className="text-gray-600 text-xs">
            Designed & Developed by <a onClick={handleAdminClick} className="font-semibold text-primary-500 hover:text-primary-400 transition-colors cursor-pointer">Devansh Yadav</a> | Student Developer Portfolio {currentYear}
          </p>
        </div>
      </div>
    </footer>
  );
}
