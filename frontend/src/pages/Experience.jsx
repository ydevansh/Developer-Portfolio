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
  const visibleChips = selectedJourney.chips.slice(0, 3);

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
    jobTitle: 'AI/ML Developer and Web Developer',
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
    <div className="relative overflow-hidden pt-28 pb-14 lg:pt-32 lg:pb-16">
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
        <div className="absolute -top-24 left-[-10rem] h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute top-16 right-[-10rem] h-96 w-96 rounded-full bg-fuchsia-500/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.14),transparent_30%),radial-gradient(circle_at_82%_10%,rgba(168,85,247,0.16),transparent_28%),radial-gradient(circle_at_50%_90%,rgba(59,130,246,0.1),transparent_34%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]"
        >
          <div className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/80">Experience</p>
              <h1 className="mt-3 text-3xl font-bold sm:text-4xl lg:text-5xl">Learning Journey</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
                A quick snapshot of how I grow as a developer through BCA academics, an AI minor, full stack projects, and daily practice.
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200">BCA at BBDU</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200">AI Minor at IIT Mandi</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200">Full Stack Projects</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200">Daily Practice</span>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(56,189,248,0.25)] transition-transform duration-300 hover:scale-[1.02]"
              >
                View Projects <FaArrowRight className="text-xs" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-100 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-cyan-500/10"
              >
                Contact Me <FaArrowRight className="text-xs" />
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-3 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-300/70">Focus</p>
                <p className="mt-1.5 text-sm font-semibold text-white">Academic + practical growth</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-3 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-300/70">Approach</p>
                <p className="mt-1.5 text-sm font-semibold text-white">Learn, build, repeat</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-3 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-300/70">Goal</p>
                <p className="mt-1.5 text-sm font-semibold text-white">Ship useful, intelligent apps</p>
              </div>
            </div>
          </div>

          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/65 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.24)] sm:p-6"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${selectedJourney.accent} opacity-10`} />
            <div className="relative flex h-full flex-col">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/80">Current focus</p>
              <div className="mt-3 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white sm:text-2xl">{selectedJourney.title}</h2>
                  <p className="mt-1.5 text-xs text-slate-400 sm:text-sm">
                    {selectedJourney.subtitle} <span className="mx-2 text-slate-600">|</span> {selectedJourney.period}
                  </p>
                </div>
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${selectedJourney.accent} shadow-lg shadow-cyan-500/15`}>
                  <SelectedJourneyIcon className="text-xl text-white" />
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-300">{selectedJourney.summary}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {visibleChips.map((chip) => (
                  <span
                    key={`${selectedJourney.id}-${chip}`}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-200"
                  >
                    {chip}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-100">
                  {selectedJourney.outcomeLabel}: {selectedJourney.outcomeValue}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }} className="mt-14 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-primary-400 mb-2">Interactive Timeline</p>
              <h2 className="text-3xl font-bold md:text-4xl">Tap a milestone to explore it</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-400">
                Each card below represents a stage in my journey. Selecting one updates the detailed panel so you can read the context, the lessons, and what I am focused on next.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {journeyItems.map((item) => {
              const JourneyIcon = item.icon;
              const isSelected = selectedJourney.id === item.id;

              return (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedJourneyId(item.id)}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.99 }}
                  className={`group relative h-full min-h-[240px] overflow-hidden rounded-2xl border p-5 text-left shadow-[0_18px_35px_rgba(2,6,23,0.35)] transition-all duration-300 ${
                    isSelected
                      ? 'border-cyan-400/55 bg-white/[0.08]'
                      : 'border-white/10 bg-gradient-to-br from-slate-950/80 via-blue-950/35 to-slate-900/80 hover:border-cyan-400/35'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-10`} />
                  <div className="relative flex h-full flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent} shadow-lg shadow-cyan-500/15`}>
                        <JourneyIcon className="text-xl text-white" />
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[0.68rem] text-slate-300">
                        {item.period}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2">
                      <p className="text-xs uppercase tracking-[0.18em] text-cyan-300/70">{item.subtitle}</p>
                      <h3 className="text-xl font-semibold leading-tight text-white">{item.title}</h3>
                      <p className="text-sm leading-6 text-gray-300">{item.summary}</p>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.chips.slice(0, 2).map((chip) => (
                        <span
                          key={`${item.id}-${chip}`}
                          className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[0.68rem] text-slate-200"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>

                    <span className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-medium text-cyan-300 transition-transform duration-300 group-hover:translate-x-1">
                      Select journey <FaArrowRight className="text-xs" />
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedJourney.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/60 p-5 shadow-[0_18px_35px_rgba(2,6,23,0.35)] sm:p-6"
            >
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${selectedJourney.accent}`} />
              <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="space-y-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/80">Selected journey</p>
                    <h3 className="mt-2 text-2xl font-bold text-white sm:text-3xl">{selectedJourney.detailTitle}</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">{selectedJourney.detailText}</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {selectedJourney.detailPoints.map((point) => (
                      <div key={point} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                        <p className="text-sm leading-6 text-slate-200">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/70">Why it matters</p>
                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      {selectedJourney.title === 'AI Minor Program' &&
                        'This is where my AI learning started to feel practical. It sharpened my curiosity, forced me to think in systems, and made me more comfortable with structured learning.'}
                      {selectedJourney.title === 'BCA Program' &&
                        'This is the academic foundation that supports everything else I build. It keeps me grounded in programming basics while I grow into more advanced work.'}
                      {selectedJourney.title === 'Full Stack Projects' &&
                        'Projects are where I test whether I really understand what I learn. They bring together UI, backend logic, data flow, and deployment into one working product.'}
                      {selectedJourney.title === 'Continuous Learning' &&
                        'Daily practice keeps the momentum alive. The habit of learning every day is what helps me improve without losing consistency when college or projects get busy.'}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/70">Current outcome</p>
                    <p className="mt-3 text-lg font-semibold text-white">{selectedJourney.outcomeValue}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      I use this stage to guide my next step and keep the journey moving in a clear direction.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {selectedJourney.ctaExternal ? (
                  <a
                    href={selectedJourney.ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-fit items-center gap-2 text-sm font-medium text-cyan-300 hover:text-cyan-200"
                  >
                    {selectedJourney.ctaLabel} <FaArrowRight className="text-xs" />
                  </a>
                ) : (
                  <Link
                    to={selectedJourney.ctaHref}
                    className="inline-flex w-fit items-center gap-2 text-sm font-medium text-cyan-300 hover:text-cyan-200"
                  >
                    {selectedJourney.ctaLabel} <FaArrowRight className="text-xs" />
                  </Link>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={goToPreviousJourney}
                    className="rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-sm font-medium text-slate-100 transition-colors duration-300 hover:border-cyan-400/40 hover:bg-cyan-500/10"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={goToNextJourney}
                    className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-100 transition-all duration-300 hover:border-cyan-300/60 hover:bg-cyan-500/15"
                  >
                    Next journey <FaArrowRight className="text-xs" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          className="mt-14 grid gap-4 md:grid-cols-3"
        >
          {learningLoop.map((item) => {
            const LoopIcon = item.icon;

            return (
              <motion.article
                key={item.title}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.24, ease: 'easeOut' }}
                className="rounded-2xl border border-white/10 bg-slate-950/45 p-5 backdrop-blur-xl"
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent} shadow-lg shadow-cyan-500/15`}>
                  <LoopIcon className="text-xl text-white" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-300">{item.description}</p>
              </motion.article>
            );
          })}
        </motion.section>
      </div>
    </div>
  );
}