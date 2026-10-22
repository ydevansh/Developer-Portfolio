import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaInstagram, FaTwitter } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleAdminClick = () => {
    window.location.href = '/admin/login';
  };

  const socialLinks = [
    { label: 'GitHub', icon: FaGithub, url: 'https://github.com/ydevansh' },
    { label: 'LinkedIn', icon: FaLinkedin, url: 'https://www.linkedin.com/in/ydevansh/' },
    { label: 'LeetCode', icon: SiLeetcode, url: 'https://leetcode.com/u/ydevansh/' },
    { label: 'Instagram', icon: FaInstagram, url: 'https://www.instagram.com/codewithdeva/' },
    { label: 'Twitter', icon: FaTwitter, url: 'https://x.com/yxdevansh' },
  ];

  return (
    <footer className="bg-black border-t border-[#00E5FF]/15 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Terminal prompt top line */}
        <div className="font-mono text-[11px] text-[#00E5FF]/40 mb-8 text-center tracking-widest">
          // eof — devansh.portfolio@{currentYear}
        </div>

        {/* Policy Links */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-10 text-sm">
          <Link
            to="/privacy-policy"
            className="font-mono text-gray-500 hover:text-[#00E5FF] transition-colors border border-transparent hover:border-[#00E5FF]/30 px-2 py-0.5"
            style={{ borderRadius: '0px' }}
          >
            ./privacy-policy
          </Link>
          <div className="hidden md:block w-px h-4 bg-[#00E5FF]/20"></div>
          <Link
            to="#"
            className="font-mono text-gray-500 hover:text-[#00E5FF] transition-colors border border-transparent hover:border-[#00E5FF]/30 px-2 py-0.5"
            style={{ borderRadius: '0px' }}
          >
            ./terms
          </Link>
          <div className="hidden md:block w-px h-4 bg-[#00E5FF]/20"></div>
          <Link
            to="#"
            className="font-mono text-gray-500 hover:text-[#00E5FF] transition-colors border border-transparent hover:border-[#00E5FF]/30 px-2 py-0.5"
            style={{ borderRadius: '0px' }}
          >
            ./refund-policy
          </Link>
        </div>

        {/* Social Icons */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
          {socialLinks.map(({ label, icon: Icon, url }) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-8 w-8 items-center justify-center border border-white/10 bg-white/[0.03] text-gray-400 transition-all duration-300 hover:border-[#00E5FF]/50 hover:text-[#00E5FF] hover:-translate-y-0.5"
              style={{ borderRadius: '0px' }}
            >
              <Icon size={14} />
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-[#00E5FF]/10 mb-8"></div>

        {/* Copyright & Credits */}
        <div className="space-y-3 text-center font-mono">
          <p className="text-gray-500 text-sm">
            <span className="text-[#00E5FF]/40">©</span> {currentYear}{' '}
            <a
              onClick={handleAdminClick}
              className="text-[#00E5FF] hover:text-white transition-colors font-semibold cursor-pointer"
            >
              Devansh Yadav
            </a>
            <span className="text-[#00E5FF]/40"> · </span>
            <span className="text-gray-600">All rights reserved</span>
          </p>
          <p className="text-gray-600 text-xs">
            <span className="text-[#00E5FF]/30">&gt;&gt;</span> Built with React · Vite · Node.js
          </p>
          <p className="text-gray-700 text-xs">
            Designed &amp; Developed by{' '}
            <a
              onClick={handleAdminClick}
              className="font-semibold text-[#00E5FF]/60 hover:text-[#00E5FF] transition-colors cursor-pointer"
            >
              Devansh Yadav
            </a>{' '}
            · Student Developer Portfolio {currentYear}
          </p>
        </div>
      </div>
    </footer>
  );
}
