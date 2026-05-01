import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPenNib } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

function TypewriterParagraphs({ firstText, secondText, active, delay = 0, speed = 22, className = '' }) {
  const fullText = `${firstText}${secondText}`;
  const [displayText, setDisplayText] = useState('');
  const isTyping = active && displayText.length < fullText.length;
  const isOnFirstParagraph = displayText.length <= firstText.length;
  const firstDisplay = displayText.slice(0, firstText.length);
  const secondDisplay = displayText.length > firstText.length ? displayText.slice(firstText.length) : '';

  useEffect(() => {
    if (!active) {
      setDisplayText('');
      return undefined;
    }

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
        <p aria-hidden="true" className="invisible text-lg">
          {firstText}
        </p>
        <p aria-hidden="true" className="absolute inset-0 pointer-events-none text-lg">
          {firstDisplay}
          {active && isOnFirstParagraph && isTyping && (
            <motion.span
              aria-hidden="true"
              className="ml-1 inline-flex items-center align-baseline text-amber-300/90"
              animate={{ y: [0, -1, 0], rotate: [14, 20, 14], x: [0, 1, 0] }}
              transition={{ duration: 0.45, repeat: Infinity, ease: 'easeInOut' }}
            >
              <FaPenNib size={11} />
            </motion.span>
          )}
          {active && isOnFirstParagraph && (
            <motion.span
              aria-hidden="true"
              className="ml-0.5 inline-block text-amber-300"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
            >
              |
            </motion.span>
          )}
        </p>
      </div>

      <div className="relative">
        <p aria-hidden="true" className="invisible text-lg">
          {secondText}
        </p>
        <p aria-hidden="true" className="absolute inset-0 pointer-events-none text-lg">
          {secondDisplay}
          {active && !isOnFirstParagraph && isTyping && (
            <motion.span
              aria-hidden="true"
              className="ml-1 inline-flex items-center align-baseline text-amber-300/90"
              animate={{ y: [0, -1, 0], rotate: [14, 20, 14], x: [0, 1, 0] }}
              transition={{ duration: 0.45, repeat: Infinity, ease: 'easeInOut' }}
            >
              <FaPenNib size={11} />
            </motion.span>
          )}
          {active && !isOnFirstParagraph && (
            <motion.span
              aria-hidden="true"
              className="ml-0.5 inline-block text-amber-300"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
            >
              |
            </motion.span>
          )}
        </p>
      </div>

      <span className="sr-only">{firstText}</span>
      <span className="sr-only">{secondText}</span>
    </div>
  );
}

const aboutSeo = {
  title: 'About Devansh Yadav | AI/ML Developer from Lucknow',
  description:
    'Learn about Devansh Yadav, an AI/ML Developer and Web Developer from Lucknow who studies at Babu Banarasi Das University (BBDU) and builds practical projects.',
  keywords: ['Devansh Yadav', 'Devansh Lucknow', 'Devansh BBD', 'AI/ML Developer', 'Web Developer', 'BBDU'],
};

export default function About() {
  const aboutSectionRef = useRef(null);
  const [isAboutVisible, setIsAboutVisible] = useState(false);

  useEffect(() => {
    const sectionElement = aboutSectionRef.current;

    if (!sectionElement) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsAboutVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.35,
        rootMargin: '0px 0px -10% 0px',
      },
    );

    observer.observe(sectionElement);

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={aboutSectionRef}
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
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

          <div className="pt-8">
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
