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
   Terminal-styled dropdown for resume actions.
──────────────────────────────────────────────────────────────────── */
function ResumeDropdown({ size = 'md', onAction }) {
  const [open, setOpen] = useState(false);
  const ref  = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

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
      {/* Trigger button — terminal ghost style */}
      <button
        id="navbar-resume-btn"
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        className={`font-mono flex items-center gap-2 border border-[#00E5FF]/60 text-[#00E5FF] bg-transparent
          transition-all duration-200 hover:bg-[#00E5FF] hover:text-black
          ${isSm ? 'px-3 py-1.5 text-xs gap-1.5' : 'px-3.5 py-2 text-xs'}`}
        style={{ borderRadius: '0px' }}
      >
        <span>./resume</span>
        <FaDownload size={isSm ? 11 : 12} />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute right-0 top-full mt-1 w-52 overflow-hidden border border-[#00E5FF]/30
            bg-black/95 backdrop-blur-xl shadow-[0_16px_48px_rgba(0,229,255,0.1)]"
          style={{ animation: 'dropIn 0.18s cubic-bezier(0.34,1.56,0.64,1) both', borderRadius: '0px' }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-[#00E5FF]/15 px-4 py-2.5">
            <FaFilePdf className="text-red-400 shrink-0" size={12} />
            <span className="font-mono text-[11px] font-medium text-white/60 truncate">
              {RESUME_FILENAME}
            </span>
          </div>

          {/* View option */}
          <button
            id="navbar-resume-view"
            type="button"
            onClick={handleView}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium
              text-white/80 transition-colors hover:bg-[#00E5FF]/10 hover:text-[#00E5FF] group font-mono"
          >
            <span className="flex h-7 w-7 items-center justify-center border border-[#00E5FF]/30
              bg-[#00E5FF]/10 group-hover:bg-[#00E5FF]/20 transition-colors shrink-0">
              <FaEye size={12} className="text-[#00E5FF]" />
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
              text-white/80 transition-colors hover:bg-[#00E5FF]/10 hover:text-[#00E5FF] group
              border-t border-[#00E5FF]/10 font-mono"
          >
            <span className="flex h-7 w-7 items-center justify-center border border-[#00E5FF]/30
              bg-[#00E5FF]/10 group-hover:bg-[#00E5FF]/20 transition-colors shrink-0">
              <FaDownload size={11} className="text-[#00E5FF]" />
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
      {/* Announcement Bar — terminal style */}
      {showAnnouncement && (
        <div className="border-b border-[#00E5FF]/15 bg-black/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-1.5 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-2 text-[10px] font-medium text-[#00E5FF]/80 sm:text-xs font-mono">
              <span className="h-2 w-2 shrink-0 bg-[#00E5FF] shadow-[0_0_14px_rgba(0,229,255,0.9)] animate-pulse" />
              <span className="shrink-0 font-semibold text-[#00E5FF]">STATUS: OPEN_TO_OPPORTUNITIES</span>
              <span className="hidden min-w-0 truncate text-[#00E5FF]/50 sm:inline">
                · Internships, freelance &amp; collaborations
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Link
                to="/contact"
                className="font-mono inline-flex items-center gap-1.5 border border-[#00E5FF]/40 bg-transparent px-3 py-1 text-[10px] font-semibold text-[#00E5FF] transition-all hover:bg-[#00E5FF] hover:text-black sm:text-xs"
                style={{ borderRadius: '0px' }}
              >
                ./contact
                <FaArrowRight size={9} />
              </Link>
              <button
                type="button"
                aria-label="Dismiss announcement"
                onClick={() => setShowAnnouncement(false)}
                className="p-1 text-[#00E5FF]/40 transition-colors hover:bg-white/5 hover:text-[#00E5FF]"
              >
                <FaTimes size={11} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Nav */}
      <nav aria-label="Primary navigation" className="border-b border-[#00E5FF]/15 bg-black/95 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between gap-4">

            {/* Logo — terminal brand */}
            <Link to="/" className="group flex shrink-0 items-center">
              <span
                data-loader-target="brand-text"
                className="font-mono text-2xl font-extrabold tracking-tight text-[#00E5FF]
                           transition-all duration-300 group-hover:text-white group-hover:drop-shadow-[0_0_12px_rgba(0,229,255,0.8)]
                           select-none"
              >
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
                    `font-mono px-3 py-1.5 text-[13px] font-medium transition-all duration-200 ${
                      isActive
                        ? 'border border-[#00E5FF]/60 bg-[#00E5FF]/10 text-[#00E5FF]'
                        : 'text-gray-400 hover:border hover:border-[#00E5FF]/30 hover:text-[#00E5FF]'
                    }`
                  }
                  style={{ borderRadius: '0px' }}
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
                      className="flex h-7 w-7 items-center justify-center border border-white/15 text-gray-400 transition-all duration-200 hover:border-[#00E5FF]/50 hover:text-[#00E5FF]"
                      style={{ borderRadius: '0px' }}
                    >
                      <Icon size={14} />
                    </a>
                  );
                })}
              </div>

              <div className="h-4 w-px bg-[#00E5FF]/20" />

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
                    className="text-gray-400 transition-colors hover:text-[#00E5FF]"
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
                className="border border-[#00E5FF]/30 p-2 text-[#00E5FF] transition-colors hover:bg-[#00E5FF]/10"
                aria-label="Toggle menu"
                style={{ borderRadius: '0px' }}
              >
                {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="border border-[#00E5FF]/30 p-2 text-[#00E5FF] transition-colors hover:bg-[#00E5FF]/10 md:hidden"
              aria-label="Toggle menu"
              style={{ borderRadius: '0px' }}
            >
              {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>

          {/* Mobile / Tablet Dropdown Menu */}
          {menuOpen && (
            <div className="border-t border-[#00E5FF]/15 py-3 xl:hidden">
              {/* Single vertical column of nav links */}
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    end={link.path === '/'}
                    className={({ isActive }) =>
                      `font-mono px-4 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? 'border border-[#00E5FF]/40 bg-[#00E5FF]/10 text-[#00E5FF]'
                          : 'text-gray-300 hover:bg-white/5 hover:text-[#00E5FF]'
                      }`
                    }
                    style={{ borderRadius: '0px' }}
                    onClick={() => setMenuOpen(false)}
                  >
                    &gt; {link.name}
                  </NavLink>
                ))}
              </div>

              {/* Mobile bottom row */}
              <div className="mt-3 flex items-center justify-between border-t border-[#00E5FF]/15 pt-3">
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
                        className="text-gray-400 transition-colors hover:text-[#00E5FF]"
                      >
                        <Icon size={18} />
                      </a>
                    );
                  })}
                </div>

                {/* Resume toggle */}
                <div className="flex flex-col items-end gap-2">
                  <button
                    id="mobile-resume-toggle"
                    type="button"
                    onClick={() => setMobileResumeOpen(v => !v)}
                    className="font-mono flex items-center gap-1.5 border border-[#00E5FF]/60 px-3 py-2
                      text-xs font-semibold text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black transition-colors"
                    style={{ borderRadius: '0px' }}
                  >
                    <FaFilePdf size={11} />
                    ./resume
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
                        className="font-mono flex items-center gap-1.5 border border-[#00E5FF]/30
                          px-3 py-2 text-xs font-semibold text-[#00E5FF]/80 hover:bg-[#00E5FF]/10 hover:text-[#00E5FF] transition-colors"
                        style={{ borderRadius: '0px' }}
                      >
                        <FaEye size={11} />
                        View
                      </a>
                      <a
                        id="mobile-resume-download"
                        href={RESUME_PATH}
                        download={RESUME_FILENAME}
                        onClick={() => { setMenuOpen(false); setMobileResumeOpen(false); }}
                        className="font-mono flex items-center gap-1.5 border border-[#00E5FF]/60
                          px-3 py-2 text-xs font-semibold text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black transition-colors"
                        style={{ borderRadius: '0px' }}
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
