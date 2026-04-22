import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaArrowRight, FaBars, FaDownload, FaEnvelope, FaGithub, FaLinkedin, FaTimes, FaTwitter } from 'react-icons/fa';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Skills', path: '/skills' },
    { name: 'Experience', path: '/experience' },
    { name: 'Projects', path: '/projects' },
    { name: 'Services', path: '/services' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const socialLinks = [
    { icon: FaGithub, url: 'https://github.com/ydevansh' },
    { icon: FaLinkedin, url: 'https://www.linkedin.com/in/ydevansh/' },
    { icon: FaTwitter, url: 'https://x.com/yxdevansh' },
    { icon: FaEnvelope, url: 'mailto:yaduvanshidevansh3336@gmail.com' },
  ];

  return (
    <header className="fixed left-0 top-0 z-50 w-full">
      {showAnnouncement && (
        <div className="border-b border-emerald-500/15 bg-slate-950/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3 text-[11px] font-medium text-emerald-100 sm:text-sm">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(74,222,128,0.9)]" />
              <span className="truncate font-semibold">Open to opportunities</span>
              <span className="hidden min-w-0 truncate text-emerald-100/75 sm:inline">
                Internships, freelance & collaborations
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/15 px-3.5 py-1.5 text-[11px] font-semibold text-emerald-100 transition-colors hover:border-emerald-300/40 hover:bg-emerald-500/25 sm:text-sm"
              >
                Let&apos;s talk
                <FaArrowRight size={11} />
              </Link>
              <button
                type="button"
                aria-label="Dismiss announcement"
                onClick={() => setShowAnnouncement(false)}
                className="rounded-full p-1.5 text-emerald-100/70 transition-colors hover:bg-white/5 hover:text-white"
              >
                <FaTimes size={12} />
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="border-b border-white/10 bg-primary-900/95 shadow-[0_12px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="group flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-primary-500 to-secondary font-bold text-white shadow-[0_10px_24px_rgba(0,116,217,0.28)]">
                DY
              </div>
              <span className="hidden text-xl font-bold text-transparent sm:inline bg-gradient-to-r from-primary-500 to-secondary bg-clip-text">
                Devansh
              </span>
            </Link>

            <div className="hidden items-center space-x-2 md:flex">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 text-white shadow-[0_12px_30px_rgba(139,92,246,0.35)]'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            <div className="hidden items-center space-x-4 md:flex">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 transition-colors duration-300 hover:text-primary-500"
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
              <a
                href="#resume"
                className="ml-20 flex items-center space-x-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white transition-colors duration-300 hover:bg-primary-600"
              >
                <span>Resume</span>
                <FaDownload size={14} />
              </a>
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white md:hidden"
              aria-label="Toggle menu"
            >
              {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          {menuOpen && (
            <div className="border-t border-white/10 pb-4 md:hidden">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `block rounded-xl px-4 py-2.5 text-sm transition-colors ${
                      isActive ? 'bg-white/8 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-primary-500'
                    }`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {link.name}
                </NavLink>
              ))}
              <a
                href="#resume"
                className="block rounded-xl px-4 py-2.5 font-medium text-primary-500 transition-colors hover:bg-white/5 hover:text-primary-400"
                onClick={() => setMenuOpen(false)}
              >
                Resume
              </a>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
