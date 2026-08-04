import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  FaArrowRight,
  FaBars,
  FaDownload,
  FaEnvelope,
  FaEye,
  FaFilePdf,
  FaGithub,
  FaLinkedin,
  FaTimes,
  FaTwitter,
} from 'react-icons/fa';

const RESUME_PATH     = '/resume.pdf';
const RESUME_FILENAME = 'Devansh_Yadav_Resume.pdf';

/* ── ResumeDropdown ─────────────────────────────────────────────────
   Self-contained dropdown button. Renders the trigger button and,
   when open, an animated panel with View + Download options.
   Closes on outside-click or Escape.
──────────────────────────────────────────────────────────────────── */
function ResumeDropdown({ size = 'md', onAction }) {
  const [open, setOpen] = useState(false);
  const ref  = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return undefined;
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const isSm = size === 'sm';

  const handleView = () => {
    window.open(RESUME_PATH, '_blank', 'noopener,noreferrer');
    setOpen(false);
    onAction?.();
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href     = RESUME_PATH;
    a.download = RESUME_FILENAME;
    a.click();
    setOpen(false);
    onAction?.();
  };

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        id="navbar-resume-btn"
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        className={`flex items-center gap-2 rounded-lg bg-primary-500 font-semibold text-white
          transition-all duration-200 hover:bg-primary-600 shadow-[0_6px_18px_rgba(0,116,217,0.3)]
          ${isSm ? 'px-3 py-1.5 text-xs gap-1.5' : 'px-3.5 py-2 text-xs'}`}
      >
        <span>Resume</span>
        <FaDownload size={isSm ? 11 : 12} />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl border border-white/10
            bg-slate-900/95 backdrop-blur-xl shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
          style={{ animation: 'dropIn 0.18s cubic-bezier(0.34,1.56,0.64,1) both' }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-white/8 px-4 py-2.5">
            <FaFilePdf className="text-red-400 shrink-0" size={12} />
            <span className="text-[11px] font-medium text-white/60 truncate">
              {RESUME_FILENAME}
            </span>
          </div>

          {/* View option */}
          <button
            id="navbar-resume-view"
            type="button"
            onClick={handleView}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium
              text-white/80 transition-colors hover:bg-white/6 hover:text-white group"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/15
              border border-blue-400/20 group-hover:bg-blue-500/25 transition-colors shrink-0">
              <FaEye size={12} className="text-blue-400" />
            </span>
            <div>
              <p className="text-[13px] font-semibold text-white">View Resume</p>
              <p className="text-[10px] text-white/40">Opens in new tab</p>
            </div>
          </button>

          {/* Download option */}
          <button
            id="navbar-resume-download"
            type="button"
            onClick={handleDownload}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium
              text-white/80 transition-colors hover:bg-white/6 hover:text-white group
              border-t border-white/6"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15
              border border-emerald-400/20 group-hover:bg-emerald-500/25 transition-colors shrink-0">
              <FaDownload size={11} className="text-emerald-400" />
            </span>
            <div>
              <p className="text-[13px] font-semibold text-white">Download PDF</p>
              <p className="text-[10px] text-white/40">Saves to your device</p>
            </div>
          </button>
        </div>
      )}

      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  );
}

/* ── Navbar ─────────────────────────────────────────────────────── */
export default function Navbar() {
  const [menuOpen, setMenuOpen]               = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [mobileResumeOpen, setMobileResumeOpen] = useState(false);

  const navLinks = [
    { name: 'Home',       path: '/' },
    { name: 'About',      path: '/about' },
    { name: 'Skills',     path: '/skills' },
    { name: 'Experience', path: '/experience' },
    { name: 'Projects',   path: '/projects' },
    { name: 'Services',   path: '/services' },
    { name: 'Blog',       path: '/blog' },
    { name: 'Contact',    path: '/contact' },
  ];

  const socialLinks = [
    { icon: FaGithub,   url: 'https://github.com/ydevansh',                    label: 'GitHub' },
    { icon: FaLinkedin, url: 'https://www.linkedin.com/in/ydevansh/',           label: 'LinkedIn' },
    { icon: FaTwitter,  url: 'https://x.com/yxdevansh',                        label: 'Twitter' },
    { icon: FaEnvelope, url: 'mailto:yaduvanshidevansh3336@gmail.com',          label: 'Email' },
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

            {/* Desktop Nav Links */}
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

            {/* Desktop Right */}
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

              {/* Resume dropdown — desktop */}
              <ResumeDropdown size="md" />
            </div>

            {/* Tablet: social icons + resume dropdown + hamburger */}
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

              {/* Resume dropdown — tablet */}
              <ResumeDropdown size="sm" />

              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="rounded-lg border border-white/10 p-2 text-white transition-colors hover:bg-white/5"
                aria-label="Toggle menu"
              >
                {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
              </button>
            </div>

            {/* Mobile hamburger */}
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
              {/* Single vertical column of nav links */}
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    end={link.path === '/'}
                    className={({ isActive }) =>
                      `rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
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
                {/* Social icons */}
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

                {/* Resume toggle — tap to reveal View & Download */}
                <div className="flex flex-col items-end gap-2">
                  <button
                    id="mobile-resume-toggle"
                    type="button"
                    onClick={() => setMobileResumeOpen(v => !v)}
                    className="flex items-center gap-1.5 rounded-lg bg-primary-500 px-3 py-2
                      text-xs font-semibold text-white hover:bg-primary-600 transition-colors"
                  >
                    <FaFilePdf size={11} />
                    Resume
                    <span
                      className="transition-transform duration-200"
                      style={{ display: 'inline-block', transform: mobileResumeOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                      ▾
                    </span>
                  </button>

                  {mobileResumeOpen && (
                    <div className="flex items-center gap-2">
                      <a
                        id="mobile-resume-view"
                        href={RESUME_PATH}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => { setMenuOpen(false); setMobileResumeOpen(false); }}
                        className="flex items-center gap-1.5 rounded-lg border border-white/12 bg-white/6
                          px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        <FaEye size={11} />
                        View
                      </a>
                      <a
                        id="mobile-resume-download"
                        href={RESUME_PATH}
                        download={RESUME_FILENAME}
                        onClick={() => { setMenuOpen(false); setMobileResumeOpen(false); }}
                        className="flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/20
                          px-3 py-2 text-xs font-semibold text-emerald-100 hover:bg-emerald-500/30 transition-colors"
                      >
                        <FaDownload size={11} />
                        Download
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
