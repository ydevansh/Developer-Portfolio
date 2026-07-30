import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPenNib, FaDownload, FaEye, FaFilePdf, FaTimes, FaExpand } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

/* ──────────────────────────────────────────────────────
   Resume PDF path — update this if the filename changes
────────────────────────────────────────────────────── */
const RESUME_PATH = '/resume.pdf';
const RESUME_FILENAME = 'Devansh_Yadav_Resume.pdf';

/* ──────────────────────────────────────────────────────
   TypewriterParagraphs  (unchanged from original)
────────────────────────────────────────────────────── */
function TypewriterParagraphs({ firstText, secondText, active, delay = 0, speed = 22, className = '' }) {
  const fullText = `${firstText}${secondText}`;
  const [displayText, setDisplayText] = useState('');
  const isTyping = active && displayText.length < fullText.length;
  const isOnFirstParagraph = displayText.length <= firstText.length;
  const firstDisplay = displayText.slice(0, firstText.length);
  const secondDisplay = displayText.length > firstText.length ? displayText.slice(firstText.length) : '';

  useEffect(() => {
    if (!active) { setDisplayText(''); return undefined; }
    let cancelled = false;
    let startTimeoutId;
    let stepTimeoutId;

    const beginTyping = () => {
      let index = 0;
      const typeNextCharacter = () => {
        if (cancelled) return;
        index += 1;
        setDisplayText(fullText.slice(0, index));
        if (index < fullText.length) {
          stepTimeoutId = window.setTimeout(typeNextCharacter, speed);
        }
      };
      typeNextCharacter();
    };

    startTimeoutId = window.setTimeout(beginTyping, delay);
    return () => {
      cancelled = true;
      window.clearTimeout(startTimeoutId);
      window.clearTimeout(stepTimeoutId);
    };
  }, [active, delay, fullText, speed]);

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="relative">
        <p aria-hidden="true" className="invisible text-lg">{firstText}</p>
        <p aria-hidden="true" className="absolute inset-0 pointer-events-none text-lg">
          {firstDisplay}
          {active && isOnFirstParagraph && isTyping && (
            <motion.span aria-hidden="true" className="ml-1 inline-flex items-center align-baseline text-amber-300/90"
              animate={{ y: [0, -1, 0], rotate: [14, 20, 14], x: [0, 1, 0] }}
              transition={{ duration: 0.45, repeat: Infinity, ease: 'easeInOut' }}>
              <FaPenNib size={11} />
            </motion.span>
          )}
          {active && isOnFirstParagraph && (
            <motion.span aria-hidden="true" className="ml-0.5 inline-block text-amber-300"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}>|</motion.span>
          )}
        </p>
      </div>

      <div className="relative">
        <p aria-hidden="true" className="invisible text-lg">{secondText}</p>
        <p aria-hidden="true" className="absolute inset-0 pointer-events-none text-lg">
          {secondDisplay}
          {active && !isOnFirstParagraph && isTyping && (
            <motion.span aria-hidden="true" className="ml-1 inline-flex items-center align-baseline text-amber-300/90"
              animate={{ y: [0, -1, 0], rotate: [14, 20, 14], x: [0, 1, 0] }}
              transition={{ duration: 0.45, repeat: Infinity, ease: 'easeInOut' }}>
              <FaPenNib size={11} />
            </motion.span>
          )}
          {active && !isOnFirstParagraph && (
            <motion.span aria-hidden="true" className="ml-0.5 inline-block text-amber-300"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}>|</motion.span>
          )}
        </p>
      </div>

      <span className="sr-only">{firstText}</span>
      <span className="sr-only">{secondText}</span>
    </div>
  );
}

/* ──────────────────────────────────────────────────────
   ResumeModal — full-screen PDF viewer overlay
────────────────────────────────────────────────────── */
function ResumeModal({ isOpen, onClose }) {
  // Lock body scroll while modal is open
  useEffect(() => {
    if (isOpen) { document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = e => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="resume-modal-overlay"
          className="fixed inset-0 z-50 flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="relative z-10 flex flex-col w-full h-full max-w-5xl mx-auto"
            initial={{ scale: 0.96, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 20 }}
            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
          >
            {/* Modal toolbar */}
            <div className="flex items-center justify-between px-5 py-3 bg-[#0d1117] border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2.5">
                <FaFilePdf className="text-red-400" size={16} />
                <span className="text-sm font-medium text-white/80 tracking-wide">
                  {RESUME_FILENAME}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {/* Open in new tab */}
                <a
                  href={RESUME_PATH}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open in new tab"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  <FaExpand size={11} />
                  <span className="hidden sm:inline">Full screen</span>
                </a>

                {/* Download */}
                <a
                  href={RESUME_PATH}
                  download={RESUME_FILENAME}
                  title="Download resume"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all duration-200"
                >
                  <FaDownload size={11} />
                  <span>Download</span>
                </a>

                {/* Close */}
                <button
                  onClick={onClose}
                  id="resume-modal-close-btn"
                  aria-label="Close resume viewer"
                  className="p-2 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  <FaTimes size={14} />
                </button>
              </div>
            </div>

            {/* PDF iframe */}
            <div className="flex-1 bg-[#1a1a2e] overflow-hidden">
              <iframe
                src={`${RESUME_PATH}#toolbar=0&navpanes=0&scrollbar=1`}
                title="Devansh Yadav Resume"
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ──────────────────────────────────────────────────────
   ResumeCTA — the card shown on the About page
────────────────────────────────────────────────────── */
function ResumeCTA({ onView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(37,99,235,0.10) 0%, rgba(99,102,241,0.07) 50%, rgba(37,99,235,0.04) 100%)',
        border: '1px solid rgba(99,102,241,0.22)',
        boxShadow: '0 4px 32px rgba(37,99,235,0.08)',
      }}
    >
      {/* Decorative glow blob */}
      <div
        aria-hidden="true"
        className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)' }}
      />

      <div className="relative p-7 sm:p-8">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div
              className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.18), rgba(220,38,38,0.08))', border: '1px solid rgba(239,68,68,0.22)' }}
            >
              <FaFilePdf className="text-red-400" size={20} />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white leading-tight">My Resume</h3>
              <p className="text-sm text-slate-400 mt-0.5">
                MERN-Stack &amp; Python Developer · Updated July 2026
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <motion.button
              id="resume-view-btn"
              onClick={onView}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.14)',
                color: 'rgba(255,255,255,0.88)',
              }}
            >
              <FaEye size={13} />
              View
            </motion.button>

            <motion.a
              id="resume-download-btn"
              href={RESUME_PATH}
              download={RESUME_FILENAME}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                border: '1px solid rgba(99,102,241,0.35)',
                boxShadow: '0 0 20px rgba(37,99,235,0.3)',
              }}
            >
              <FaDownload size={12} />
              Download PDF
            </motion.a>
          </div>
        </div>

        {/* Quick stats row */}
        <div className="mt-6 pt-5 border-t border-white/8 grid grid-cols-3 gap-4">
          {[
            { label: 'Status', value: 'Open for Work' },
            { label: 'Projects', value: '10+' },
            { label: 'Certifications', value: '6+' },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-base font-bold text-blue-400">{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────
   SEO config
────────────────────────────────────────────────────── */
const aboutSeo = {
  title: 'About Devansh Yadav | AI/ML Developer from Lucknow',
  description:
    'Learn about Devansh Yadav, an AI/ML Developer and Web Developer from Lucknow who studies at Babu Banarasi Das University (BBDU) and builds practical projects.',
  keywords: ['Devansh Yadav', 'Devansh Lucknow', 'Devansh BBD', 'AI/ML Developer', 'Web Developer', 'BBDU'],
};

/* ──────────────────────────────────────────────────────
   About page (main export)
────────────────────────────────────────────────────── */
export default function About() {
  const aboutSectionRef   = useRef(null);
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [isResumeOpen,   setIsResumeOpen]   = useState(false);

  useEffect(() => {
    const el = aboutSectionRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setIsAboutVisible(true); observer.disconnect(); }
      },
      { threshold: 0.35, rootMargin: '0px 0px -10% 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="pt-32 pb-20">
      <Seo
        title={aboutSeo.title}
        description={aboutSeo.description}
        keywords={aboutSeo.keywords}
        canonicalPath="/about"
      />

      {/* Resume modal */}
      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={aboutSectionRef}
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Page heading */}
          <div className="relative inline-block isolate">
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-[-0.6rem] top-1/2 -z-10 h-12 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.32)_0%,rgba(251,191,36,0.12)_38%,transparent_72%)] blur-2xl"
              animate={{ opacity: [0.35, 0.65, 0.35], scale: [1, 1.02, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-1 rounded-full bg-gradient-to-r from-transparent via-amber-200/50 to-transparent blur-sm"
              animate={{ opacity: [0.15, 0.45, 0.15], x: ['-8%', '8%', '-8%'] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <h1 className="text-4xl md:text-5xl font-bold">About Devansh Yadav</h1>
          </div>

          {/* Bio + Education */}
          <div className="text-gray-400 leading-relaxed">
            <TypewriterParagraphs
              active={isAboutVisible}
              delay={250}
              speed={28}
              firstText="I am Devansh Yadav, an aspiring AI engineer and web developer from Lucknow with a strong foundation in Python and full stack development. I am currently pursuing a BCA at Babu Banarasi Das University (BBDU) and enjoy building intelligent, real-world applications through hands-on projects."
              secondText="My goal is to create scalable and impactful solutions using modern technologies. I have experience with React, Node.js, Python, MongoDB, and SQL, combined with AI/ML knowledge from my studies."
            />

            <div className="space-y-4 pt-8">
              <h2 className="text-2xl font-bold text-white">Education</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-white">BCA - Babu Banarasi Das University (BBDU), Lucknow</h3>
                  <p className="text-sm text-gray-500">Bachelor of Computer Applications</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white">AI Minor - IIT Mandi (Online)</h3>
                  <p className="text-sm text-gray-500">Minor in Artificial Intelligence</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Resume section ─────────────────────────────────── */}
          <div className="pt-2">
            <ResumeCTA onView={() => setIsResumeOpen(true)} />
          </div>

          {/* Skills link */}
          <div className="pt-2">
            <Link
              to="/skills"
              className="inline-block px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-lg font-medium transition-colors duration-300"
            >
              View My Skills →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
