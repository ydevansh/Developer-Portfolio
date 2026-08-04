import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  FaArrowRight,
  FaCode,
  FaFire,
  FaGraduationCap,
  FaLightbulb,
} from 'react-icons/fa';
import profileImage from '../assets/profile.jpg';
import Seo from '../components/Seo';
import { SITE_AUTHOR, SITE_SOCIAL_LINKS, SITE_URL } from '../data/siteMetadata';

const journeyItems = [
  {
    id: 'bca',
    title: 'BCA Program',
    subtitle: 'Babu Banarasi Das University, Lucknow',
    period: '2024-2027',
    summary:
      'I am building my software foundation through BCA coursework, consistent practice, and small projects that turn theory into real application.',
    chips: ['Programming basics', 'Software fundamentals', 'Academic growth'],
    detailTitle: 'Academic base and software fundamentals',
    detailText:
      'My BCA at BBDU gives me the core habits I need as a developer. I focus on understanding programming fundamentals, learning how to structure problems, and converting classroom concepts into practical work I can actually show.',
    detailPoints: [
      'Stronger problem decomposition and logic building',
      'More confidence with structured coding practice',
      'A steady academic base for full stack and AI learning',
    ],
    outcomeLabel: 'Current focus',
    outcomeValue: 'Software fundamentals',
    ctaLabel: 'NAAC official reports',
    ctaHref: 'https://bbdu.ac.in/data/disclosure/NAAC-Reports/',
    ctaExternal: true,
    accent: 'from-cyan-400 via-blue-500 to-indigo-500',
    icon: FaGraduationCap,
  },
  {
    id: 'ai-minor',
    title: 'AI Minor Program',
    subtitle: 'IIT Mandi (Online)',
    period: 'Ongoing',
    summary:
      'The AI Minor pushes me beyond the regular syllabus and helps me understand artificial intelligence through practical examples and guided learning.',
    chips: ['AI concepts', 'Mini implementations', 'Applied learning'],
    detailTitle: 'Learning AI through practice',
    detailText:
      'The IIT Mandi AI Minor helped me move from curiosity to structured learning. Instead of only memorizing terms, I explore examples, mini implementations, and revisions that make the concepts easier to retain and apply.',
    detailPoints: [
      'Data handling, machine learning basics, and structured problem solving',
      'Hands-on examples that build confidence beyond theory',
      'Daily discipline while balancing BCA coursework and projects',
    ],
    outcomeLabel: 'Current focus',
    outcomeValue: 'AI + applied learning',
    ctaLabel: 'Read the AI journey post',
    ctaHref: '/blog/my-journey-into-ai-as-a-bca-student',
    ctaExternal: false,
    accent: 'from-violet-400 via-fuchsia-500 to-purple-500',
    icon: FaLightbulb,
  },
  {
    id: 'projects',
    title: 'Full Stack Projects',
    subtitle: 'Hands-on Development',
    period: 'Build mode',
    summary:
      'I am applying what I learn by building end-to-end web apps with modern frontend, backend, and database workflows.',
    chips: ['React UI', 'Node backend', 'Database integration'],
    detailTitle: 'Turning ideas into products',
    detailText:
      'My full stack projects taught me to think like a builder. I pay attention to responsive layouts, API design, database flow, and deployment-ready structure so the output feels like a real product, not a demo.',
    detailPoints: [
      'Reusable React components and clean UI structure',
      'Node.js APIs, MongoDB flow, and integration discipline',
      'Debugging, deployment, and iteration from the first version onward',
    ],
    outcomeLabel: 'Stack',
    outcomeValue: 'React, Node.js, MongoDB',
    ctaLabel: 'Read the build story',
    ctaHref: '/blog/how-i-built-my-portfolio-from-scratch',
    ctaExternal: false,
    accent: 'from-emerald-400 via-teal-500 to-cyan-500',
    icon: FaCode,
  },
  {
    id: 'learning',
    title: 'Continuous Learning',
    subtitle: 'Daily Practice',
    period: 'Every day',
    summary:
      'I stay consistent through daily coding, debugging, system thinking, and problem solving instead of waiting for large blocks of free time.',
    chips: ['Daily coding', 'Debugging', 'Growth mindset'],
    detailTitle: 'Small goals, steady progress',
    detailText:
      'My learning routine is built around small, repeatable goals. I keep moving by coding daily, revising concepts, and solving problems step by step. That keeps momentum high without burning out.',
    detailPoints: [
      'Daily practice keeps my skills sharp and consistent',
      'I learn faster when I read, try, fail, and refactor',
      'This routine supports long-term growth in both AI and full stack work',
    ],
    outcomeLabel: 'Routine',
    outcomeValue: 'Code, learn, repeat',
    ctaLabel: 'Read the routine post',
    ctaHref: '/blog/daily-routine-to-become-a-better-developer',
    ctaExternal: false,
    accent: 'from-amber-400 via-orange-500 to-rose-500',
    icon: FaFire,
  },
];

const learningLoop = [
  {
    title: 'Learn',
    description:
      'I start with fundamentals, read docs, and break the concept into simple notes before I touch the keyboard.',
    icon: FaLightbulb,
    accent: 'from-cyan-400 via-sky-500 to-blue-500',
  },
  {
    title: 'Build',
    description:
      'I turn the idea into something real, whether that is a small prototype, a full stack feature, or a project improvement.',
    icon: FaCode,
    accent: 'from-emerald-400 via-teal-500 to-cyan-500',
  },
  {
    title: 'Repeat',
    description:
      'I review what worked, fix what did not, and use daily practice to make the next attempt sharper than the last one.',
    icon: FaFire,
    accent: 'from-amber-400 via-orange-500 to-rose-500',
  },
];

export default function Experience() {
  const [selectedJourneyId, setSelectedJourneyId] = useState('ai-minor');
  const location = useLocation();

  useEffect(() => {
    const journeyParam = new URLSearchParams(location.search).get('journey');

    if (journeyParam && journeyItems.some((item) => item.id === journeyParam)) {
      setSelectedJourneyId(journeyParam);
    }
  }, [location.search]);

  const selectedJourney = journeyItems.find((item) => item.id === selectedJourneyId) ?? journeyItems[0];
  const selectedJourneyIndex = journeyItems.findIndex((item) => item.id === selectedJourney.id);
  const SelectedJourneyIcon = selectedJourney.icon;

  const goToNextJourney = () => {
    const nextJourney = journeyItems[(selectedJourneyIndex + 1) % journeyItems.length];
    setSelectedJourneyId(nextJourney.id);
  };

  const goToPreviousJourney = () => {
    const previousJourney =
      journeyItems[(selectedJourneyIndex - 1 + journeyItems.length) % journeyItems.length];
    setSelectedJourneyId(previousJourney.id);
  };

  const experienceStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE_AUTHOR,
    alternateName: 'Devansh Yadav',
    url: SITE_URL,
    image: new URL(profileImage, SITE_URL).toString(),
    jobTitle: 'Python Developer, MERN Developer and Data Science Learner',
    description:
      'A detailed learning journey showing BCA study, IIT Mandi AI Minor, full stack projects, and daily practice.',
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Babu Banarasi Das University (BBDU)',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Lucknow',
      },
    },
    sameAs: SITE_SOCIAL_LINKS,
  };

  return (
    <div className="relative overflow-hidden pb-20 pt-28 lg:pt-32">
      <Seo
        title="Experience - Learning Journey | Devansh Yadav"
        description="Explore Devansh Yadav's detailed and interactive learning journey across BCA, IIT Mandi AI Minor, full stack projects, and daily practice."
        keywords={[
          'Devansh Yadav experience',
          'learning journey',
          'BCA',
          'IIT Mandi AI Minor',
          'full stack projects',
          'daily learning',
          'portfolio experience',
        ]}
        canonicalPath="/experience"
        image={profileImage}
        imageAlt="Devansh Yadav profile portrait"
        structuredData={experienceStructuredData}
      />

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-28 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-[-14rem] top-[28rem] h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="border-b border-white/10 pb-10 sm:pb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.15)] backdrop-blur-md mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse" />
            Experience &amp; Journey
          </div>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl bg-gradient-to-r from-cyan-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
            Learning, building, and getting better every day.
          </h1>
          <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              My journey blends BCA academics, applied AI learning, full stack projects, and a consistent practice routine.
            </p>
            <div className="flex shrink-0 items-center gap-5">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition-transform duration-300 hover:-translate-y-0.5"
              >
                View projects <FaArrowRight className="text-xs" />
              </Link>
              <Link to="/contact" className="text-sm font-medium text-slate-300 transition-colors hover:text-white">
                Contact me
              </Link>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          className="mt-10 grid items-start gap-6 lg:grid-cols-[19rem_minmax(0,1fr)] lg:gap-8"
        >
          <aside className="lg:sticky lg:top-28">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/70">The journey</p>
                <h2 className="mt-1 text-xl font-semibold text-white">Milestones</h2>
              </div>
              <span className="text-xs text-slate-500">Select one</span>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {journeyItems.map((item) => {
              const JourneyIcon = item.icon;
              const isSelected = selectedJourney.id === item.id;

              return (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedJourneyId(item.id)}
                  aria-pressed={isSelected}
                  whileTap={{ scale: 0.98 }}
                  className={`group flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-300 ${
                    isSelected
                      ? 'border-cyan-400/40 bg-cyan-400/[0.08]'
                      : 'border-transparent bg-white/[0.025] hover:border-white/10 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.accent}`}>
                    <JourneyIcon className="text-base text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className={`truncate text-sm font-semibold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                      {item.title}
                    </h3>
                    <p className="mt-0.5 truncate text-xs text-slate-500">{item.subtitle}</p>
                  </div>
                  <span className={`shrink-0 text-[0.68rem] ${isSelected ? 'text-cyan-300' : 'text-slate-500'}`}>
                    {item.period}
                  </span>
                </motion.button>
              );
            })}
            </div>
          </aside>

          <AnimatePresence mode="wait">
            <motion.article
              key={selectedJourney.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/45 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.28)] backdrop-blur-xl sm:p-7 lg:p-8"
            >
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${selectedJourney.accent}`} />
              <div className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-300/70">
                    {selectedJourney.period} · {selectedJourney.subtitle}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">{selectedJourney.title}</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">{selectedJourney.summary}</p>
                </div>
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${selectedJourney.accent}`}>
                  <SelectedJourneyIcon className="text-xl text-white" />
                </div>
              </div>

              <div className="py-7">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">What this stage taught me</p>
                <h3 className="mt-2 text-xl font-semibold text-white sm:text-2xl">{selectedJourney.detailTitle}</h3>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">{selectedJourney.detailText}</p>

                <ol className="mt-6 grid gap-4 sm:grid-cols-3">
                  {selectedJourney.detailPoints.map((point, index) => (
                    <li key={point} className="border-l border-white/10 pl-4">
                      <span className="text-xs font-semibold text-cyan-300/70">0{index + 1}</span>
                      <p className="mt-2 text-sm leading-6 text-slate-200">{point}</p>
                    </li>
                  ))}
                </ol>

                <div className="mt-6 flex flex-wrap gap-2">
                  {selectedJourney.chips.map((chip) => (
                    <span key={`${selectedJourney.id}-${chip}`} className="rounded-full bg-white/[0.05] px-3 py-1.5 text-xs text-slate-300">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-5 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.18em] text-slate-500">{selectedJourney.outcomeLabel}</p>
                  <p className="mt-1 text-sm font-semibold text-white">{selectedJourney.outcomeValue}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {selectedJourney.ctaExternal ? (
                    <a
                      href={selectedJourney.ctaHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300 hover:text-cyan-200"
                    >
                      {selectedJourney.ctaLabel} <FaArrowRight className="text-xs" />
                    </a>
                  ) : (
                    <Link
                      to={selectedJourney.ctaHref}
                      className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300 hover:text-cyan-200"
                    >
                      {selectedJourney.ctaLabel} <FaArrowRight className="text-xs" />
                    </Link>
                  )}
                  <span className="hidden h-5 w-px bg-white/10 sm:block" />
                  <button
                    type="button"
                    onClick={goToPreviousJourney}
                    className="rounded-full border border-white/10 px-3.5 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-white/20 hover:text-white"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={goToNextJourney}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3.5 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-white/20 hover:text-white"
                  >
                    Next <FaArrowRight className="text-[0.65rem]" />
                  </button>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          className="mt-16 border-t border-white/10 pt-10"
        >
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/70">How I work</p>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">A simple loop that keeps me moving</h2>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-3 md:gap-0">
            {learningLoop.map((item, index) => {
              const LoopIcon = item.icon;

              return (
                <article key={item.title} className={`${index > 0 ? 'md:border-l md:border-white/10 md:pl-8' : ''} ${index < learningLoop.length - 1 ? 'md:pr-8' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${item.accent}`}>
                      <LoopIcon className="text-sm text-white" />
                    </div>
                    <span className="text-xs text-slate-500">0{index + 1}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-400">{item.description}</p>
                </article>
              );
            })}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
