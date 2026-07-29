import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  FaArrowRight,
  FaBars,
  FaDownload,
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaTimes,
  FaTwitter,
} from 'react-icons/fa';

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
    { icon: FaGithub, url: 'https://github.com/ydevansh', label: 'GitHub' },
    { icon: FaLinkedin, url: 'https://www.linkedin.com/in/ydevansh/', label: 'LinkedIn' },
    { icon: FaTwitter, url: 'https://x.com/yxdevansh', label: 'Twitter' },
    { icon: FaEnvelope, url: 'mailto:yaduvanshidevansh3336@gmail.com', label: 'Email' },
  ];

  return (
    <header className="fixed left-0 top-0 z-50 w-full">
      {/* Announcement Bar */}
      {showAnnouncement && (
        <div className="border-b border-emerald-500/15 bg-slate-950/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-1.5 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-2 text-[10px] font-medium text-emerald-100 sm:text-xs">
              <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(74,222,128,0.9)] animate-pulse" />
              <span className="shrink-0 font-semibold">Open to opportunities</span>
              <span className="hidden min-w-0 truncate text-emerald-100/70 sm:inline">
                · Internships, freelance &amp; collaborations
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/15 px-3 py-1 text-[10px] font-semibold text-emerald-100 transition-colors hover:border-emerald-300/40 hover:bg-emerald-500/25 sm:text-xs"
              >
                Let&apos;s talk
                <FaArrowRight size={9} />
              </Link>
              <button
                type="button"
                aria-label="Dismiss announcement"
                onClick={() => setShowAnnouncement(false)}
                className="rounded-full p-1 text-emerald-100/60 transition-colors hover:bg-white/5 hover:text-white"
              >
                <FaTimes size={11} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Nav */}
      <nav className="border-b border-white/10 bg-slate-950/95 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between gap-4">

            {/* Logo */}
            <Link to="/" className="group flex shrink-0 items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-primary-500 to-secondary text-[13px] font-bold text-white shadow-[0_8px_20px_rgba(0,116,217,0.3)]">
                DY
              </div>
              <span className="hidden text-lg font-bold bg-gradient-to-r from-primary-500 to-secondary bg-clip-text text-transparent sm:inline">
                Devansh
              </span>
            </Link>

            {/* Desktop Nav Links — hidden below xl */}
            <div className="hidden items-center gap-0.5 xl:flex">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `rounded-full px-3 py-1.5 text-[13px] font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 text-white shadow-[0_8px_24px_rgba(139,92,246,0.3)]'
                        : 'text-gray-300 hover:bg-white/6 hover:text-white'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            {/* Desktop Right — hidden below xl */}
            <div className="hidden items-center gap-3 xl:flex">
              {/* Social Icons */}
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="text-gray-400 transition-colors duration-200 hover:text-primary-500"
                    >
                      <Icon size={17} />
                    </a>
                  );
                })}
              </div>

              <div className="h-4 w-px bg-white/10" />

              {/* Resume Button */}
              <a
                href="/Devansh_Yadav_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download
                className="flex items-center gap-2 rounded-lg bg-primary-500 px-3.5 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-primary-600 shadow-[0_6px_18px_rgba(0,116,217,0.3)]"
              >
                <span>Resume</span>
                <FaDownload size={12} />
              </a>
            </div>

            {/* Tablet Nav — md to xl: show a condensed row with hamburger */}
            {/* On md–xl we show social icons + resume + hamburger for nav links */}
            <div className="hidden items-center gap-2 md:flex xl:hidden">
              {socialLinks.slice(0, 2).map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="text-gray-400 transition-colors hover:text-primary-500"
                  >
                    <Icon size={17} />
                  </a>
                );
              })}
              <a
                href="/Devansh_Yadav_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download
                className="flex items-center gap-1.5 rounded-lg bg-primary-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-600"
              >
                Resume
                <FaDownload size={11} />
              </a>
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="rounded-lg border border-white/10 p-2 text-white transition-colors hover:bg-white/5"
                aria-label="Toggle menu"
              >
                {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
              </button>
            </div>

            {/* Mobile hamburger — below md */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-lg border border-white/10 p-2 text-white transition-colors hover:bg-white/5 md:hidden"
              aria-label="Toggle menu"
            >
              {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>

          {/* Mobile / Tablet Dropdown Menu */}
          {menuOpen && (
            <div className="border-t border-white/10 py-3 xl:hidden">
              <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    end={link.path === '/'}
                    className={({ isActive }) =>
                      `rounded-xl px-4 py-2.5 text-sm font-medium text-center transition-colors ${
                        isActive
                          ? 'bg-gradient-to-r from-violet-500/20 to-cyan-500/20 border border-cyan-400/20 text-white'
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }`
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.name}
                  </NavLink>
                ))}
              </div>

              {/* Mobile bottom row */}
              <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                <div className="flex items-center gap-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="text-gray-400 transition-colors hover:text-primary-500"
                      >
                        <Icon size={18} />
                      </a>
                    );
                  })}
                </div>
                <a
                  href="/Devansh_Yadav_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-600"
                  onClick={() => setMenuOpen(false)}
                >
                  Resume
                  <FaDownload size={13} />
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
