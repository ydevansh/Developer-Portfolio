import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPenNib, FaDownload, FaEye, FaFilePdf, FaTimes, FaExpand } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { buildBreadcrumbSchema } from '../data/seoSchemas';

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
            <motion.span aria-hidden="true" className="ml-1 inline-flex items-center align-baseline text-[#00E5FF]/90"
              animate={{ y: [0, -1, 0], rotate: [14, 20, 14], x: [0, 1, 0] }}
              transition={{ duration: 0.45, repeat: Infinity, ease: 'easeInOut' }}>
              <FaPenNib size={11} />
            </motion.span>
          )}
          {active && isOnFirstParagraph && (
            <motion.span aria-hidden="true" className="ml-0.5 inline-block text-[#00E5FF]"
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
            <motion.span aria-hidden="true" className="ml-1 inline-flex items-center align-baseline text-[#00E5FF]/90"
              animate={{ y: [0, -1, 0], rotate: [14, 20, 14], x: [0, 1, 0] }}
              transition={{ duration: 0.45, repeat: Infinity, ease: 'easeInOut' }}>
              <FaPenNib size={11} />
            </motion.span>
          )}
          {active && !isOnFirstParagraph && (
            <motion.span aria-hidden="true" className="ml-0.5 inline-block text-[#00E5FF]"
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
  useEffect(() => {
    if (isOpen) { document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

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
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
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
            <div className="flex items-center justify-between px-5 py-3 bg-black border-b border-[#00E5FF]/20 shrink-0">
              <div className="flex items-center gap-2.5">
                <FaFilePdf className="text-red-400" size={16} />
                <span className="font-mono text-sm font-medium text-white/80 tracking-wide">
                  {RESUME_FILENAME}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={RESUME_PATH}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open in new tab"
                  className="font-mono flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/70 hover:text-[#00E5FF] hover:bg-white/5 transition-all duration-200"
                >
                  <FaExpand size={11} />
                  <span className="hidden sm:inline">Full screen</span>
                </a>

                <a
                  href={RESUME_PATH}
                  download={RESUME_FILENAME}
                  title="Download resume"
                  className="font-mono flex items-center gap-1.5 px-3 py-1.5 border border-[#00E5FF]/60 text-xs font-semibold text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black transition-all duration-200"
                  style={{ borderRadius: '0px' }}
                >
                  <FaDownload size={11} />
                  <span>Download</span>
                </a>

                <button
                  onClick={onClose}
                  id="resume-modal-close-btn"
                  aria-label="Close resume viewer"
                  className="p-2 text-white/60 hover:text-[#00E5FF] hover:bg-white/5 transition-all duration-200"
                >
                  <FaTimes size={14} />
                </button>
              </div>
            </div>

            {/* PDF iframe */}
            <div className="flex-1 bg-black overflow-hidden border border-[#00E5FF]/10 border-t-0">
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
      className="relative overflow-hidden"
      style={{
        background: 'rgba(0,229,255,0.03)',
        border: '1px solid rgba(0,229,255,0.20)',
        borderRadius: '0px',
      }}
    >
      {/* Terminal corner decorators */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#00E5FF]/60" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#00E5FF]/60" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#00E5FF]/60" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#00E5FF]/60" />

      <div className="relative p-7 sm:p-8">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div
              className="shrink-0 w-12 h-12 flex items-center justify-center border border-red-500/30 bg-red-500/10"
              style={{ borderRadius: '0px' }}
            >
              <FaFilePdf className="text-red-400" size={20} />
            </div>

            <div>
              <h3 className="font-mono text-lg font-bold text-white leading-tight">./my-resume.pdf</h3>
              <p className="font-mono text-sm text-[#A1A1AA] mt-0.5">
                MERN-Stack &amp; Python Developer · Updated July 2026
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <motion.button
              id="resume-view-btn"
              onClick={onView}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="font-mono flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all duration-200 border border-white/20 text-white/80 hover:border-[#00E5FF]/50 hover:text-[#00E5FF]"
              style={{ borderRadius: '0px' }}
            >
              <FaEye size={13} />
              View
            </motion.button>

            <motion.a
              id="resume-download-btn"
              href={RESUME_PATH}
              download={RESUME_FILENAME}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="font-mono flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#00E5FF] border border-[#00E5FF]/60 hover:bg-[#00E5FF] hover:text-black transition-all duration-200"
              style={{ borderRadius: '0px' }}
            >
              <FaDownload size={12} />
              Download PDF
            </motion.a>
          </div>
        </div>

        {/* Quick stats row */}
        <div className="mt-6 pt-5 border-t border-[#00E5FF]/10 grid grid-cols-3 gap-4">
          {[
            { label: 'Status', value: 'Open for Work' },
            { label: 'Projects', value: '10+' },
            { label: 'Certifications', value: '6+' },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="font-mono text-base font-bold text-[#00E5FF]">{value}</p>
              <p className="font-mono text-xs text-[#A1A1AA] mt-0.5">{label}</p>
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
  title: 'About Devansh Yadav | BCA Student, AI Minor Learner & Full Stack Developer',
  description:
    'Learn about Devansh Yadav, also known as Deva Yadav, a BCA student at Babu Banarasi Das University who is building a strong path in Python, MERN, React, and AI.',
  keywords: ['Devansh Yadav', 'Deva Yadav', 'BCA Student', 'BBDU', 'Python Developer', 'MERN Stack Developer', 'AI Developer'],
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
        structuredData={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ], '/about')}
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
          {/* Page heading — terminal style */}
          <div>
            <div
              className="font-mono inline-flex items-center gap-2 border border-[#00E5FF]/35 bg-[#00E5FF]/5 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#00E5FF] mb-4"
              style={{ borderRadius: '0px' }}
            >
              <span className="h-1.5 w-1.5 bg-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.8)] animate-pulse" />
              $ whoami
            </div>
            <h1 className="font-mono text-4xl md:text-5xl font-bold text-white">
              About <span className="text-[#00E5FF]">Devansh Yadav</span>
            </h1>
          </div>

          {/* Bio + Education */}
          <div className="text-[#A1A1AA] leading-relaxed">
            <TypewriterParagraphs
              active={isAboutVisible}
              delay={250}
              speed={28}
              firstText="I am Devansh Yadav, an aspiring AI engineer and web developer from Lucknow with a strong foundation in Python and full stack development. I am currently pursuing a BCA at Babu Banarasi Das University (BBDU) and enjoy building intelligent, real-world applications through hands-on projects."
              secondText="My goal is to create scalable and impactful solutions using modern technologies. I have experience with React, Node.js, Python, MongoDB, and SQL, combined with AI/ML knowledge from my studies."
            />

            <div className="space-y-4 pt-8">
              <h2 className="font-mono text-2xl font-bold text-white border-l-2 border-[#00E5FF] pl-3">
                Education
              </h2>
              <div className="space-y-4">
                <div className="border border-[#00E5FF]/20 bg-[#00E5FF]/[0.02] p-4" style={{ borderRadius: '0px' }}>
                  <h3 className="font-mono font-semibold text-white">BCA - Babu Banarasi Das University (BBDU), Lucknow</h3>
                  <p className="font-mono text-sm text-[#A1A1AA] mt-1">Bachelor of Computer Applications</p>
                </div>
                <div className="border border-[#00E5FF]/20 bg-[#00E5FF]/[0.02] p-4" style={{ borderRadius: '0px' }}>
                  <h3 className="font-mono font-semibold text-white">AI Minor - IIT Mandi (Online)</h3>
                  <p className="font-mono text-sm text-[#A1A1AA] mt-1">Minor in Artificial Intelligence</p>
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
              className="font-mono inline-flex items-center gap-2 px-6 py-3 border border-[#00E5FF]/60 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black font-medium transition-colors duration-300"
              style={{ borderRadius: '0px' }}
            >
              &gt; View My Skills →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
