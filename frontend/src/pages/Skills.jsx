import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaTimes } from 'react-icons/fa';
import skillService from '../services/skillService';
import Seo from '../components/Seo';
import { buildBreadcrumbSchema } from '../data/seoSchemas';
import {
  defaultSkillSeeds,
  getSkillDetails,
  groupSkillsByCategory,
  resolveSkillIcon,
  skillCategoryMeta,
  skillCategoryOrder,
} from '../data/skillCatalog';

const skillsSeo = {
  title: 'Skills | Python, MERN Stack, React, Node.js & AI Development',
  description:
    'Explore the skills of Devansh Yadav, a Python Developer and MERN Stack Developer from Lucknow who works with React, Node.js, MongoDB, SQL, and AI tools.',
  keywords: ['Devansh Yadav skills', 'Python Developer', 'MERN Stack Developer', 'React', 'Node.js', 'MongoDB', 'SQL', 'AI Developer'],
};

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await skillService.getAllSkills();
        const apiSkills = Array.isArray(response?.data?.skills) ? response.data.skills : [];
        setSkills(apiSkills.length > 0 ? apiSkills : defaultSkillSeeds);
      } catch (error) {
        console.error('Error fetching skills:', error);
        setSkills(defaultSkillSeeds);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const displaySkills = useMemo(() => groupSkillsByCategory(skills.length ? skills : defaultSkillSeeds), [skills]);

  const activeSkillDetails = selectedSkill ? getSkillDetails(selectedSkill) : null;

  useEffect(() => {
    if (!selectedSkill) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setSelectedSkill(null);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedSkill]);

  return (
    <div className="relative overflow-hidden pt-32 pb-20">
      <Seo
        title={skillsSeo.title}
        description={skillsSeo.description}
        keywords={skillsSeo.keywords}
        canonicalPath="/skills"
        structuredData={buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Skills', path: '/skills' },
        ], '/skills')}
      />


      {loading ? (
        <div className="pt-32 pb-20 px-4 text-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-3">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-300" />
            <span className="text-gray-300">Loading skills...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_35%,rgba(34,211,238,0.2),transparent_38%),radial-gradient(circle_at_80%_20%,rgba(192,132,252,0.18),transparent_38%),radial-gradient(circle_at_50%_100%,rgba(2,132,199,0.2),transparent_45%)]" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="rounded-3xl border border-white/10 bg-[#0a1430]/55 px-4 py-12 sm:p-10 backdrop-blur-xl"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
            >
              <div className="text-center">
                <p className="inline-flex rounded-full border border-violet-400/25 bg-violet-500/20 px-5 py-2 text-xs font-semibold tracking-[0.2em] text-violet-200">
                  WHAT I KNOW
                </p>
                <h1 className="mt-5 text-5xl md:text-6xl font-bold bg-gradient-to-r from-fuchsia-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
                  AI/ML and Web Development Skills
                </h1>
                <p className="mt-4 text-gray-300 text-lg">Technologies and tools I use to build AI/ML and full stack web apps</p>
              </div>

              <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-3">
                {skillCategoryOrder.map((category) => {
                  const theme = skillCategoryMeta[category];
                  const SectionIcon = theme.icon;
                  const categorySkills = displaySkills[category] || [];

                  return (
                    <motion.article
                      key={category}
                      whileHover={{ y: -6, scale: 1.01 }}
                      transition={{ duration: 0.28, ease: 'easeOut' }}
                      className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/45 p-5"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${theme.glowClass}`} />

                      <div className="relative">
                        <div className="flex items-center gap-3">
                          <SectionIcon className="text-3xl text-cyan-300" />
                          <h2
                            className={`text-2xl font-bold bg-gradient-to-r ${theme.titleClass} bg-clip-text text-transparent sm:text-[1.7rem]`}
                          >
                            {category}
                          </h2>
                        </div>

                        <div className="mt-5 space-y-3">
                          {categorySkills.map((entry) => {
                            const SkillIcon = resolveSkillIcon(entry);
                            const isSelected = selectedSkill?._id ? selectedSkill._id === entry._id : selectedSkill?.name === entry.name;

                            return (
                              <motion.button
                                key={entry._id || `${category}-${entry.name}`}
                                type="button"
                                onClick={() => setSelectedSkill(entry)}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.99 }}
                                className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50 ${theme.badgeClass} ${
                                  isSelected ? 'border-cyan-300/60 shadow-[0_0_26px_rgba(34,211,238,0.18)]' : 'hover:border-cyan-300/35 hover:shadow-[0_0_18px_rgba(34,211,238,0.08)]'
                                }`}
                              >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/15 text-white/95">
                                  {SkillIcon && (
                                    <SkillIcon className="text-sm" />
                                  )}
                                </div>

                                <span className="min-w-0 break-words text-sm font-semibold leading-snug text-white sm:text-[15px]">
                                  {entry.name}
                                </span>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>

              <div className="mt-10 flex justify-center">
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 px-8 py-4 text-lg font-semibold text-white shadow-[0_12px_40px_rgba(56,189,248,0.35)] transition-transform duration-300 hover:scale-[1.02]"
                >
                  View Projects Built With These Skills <FaArrowRight size={17} />
                </Link>
              </div>
            </motion.div>
          </div>

          <AnimatePresence>
            {activeSkillDetails && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.button
                  type="button"
                  aria-label="Close skill details"
                  onClick={() => setSelectedSkill(null)}
                  className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 18 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 18 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-[#0a1430] to-slate-900 shadow-[0_30px_80px_rgba(2,6,23,0.72)]"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${skillCategoryMeta[activeSkillDetails.category].glowClass} opacity-70`} />

                  <div className="relative p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-100">
                          {activeSkillDetails.category}
                        </span>
                        <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">{activeSkillDetails.name}</h3>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">{activeSkillDetails.description}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedSkill(null)}
                        className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                        aria-label="Close modal"
                      >
                        <FaTimes size={14} />
                      </button>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:col-span-2">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-200/80">
                          Used in this portfolio
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-300">{activeSkillDetails.portfolioUse}</p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-200/80">Use Cases</p>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                        {activeSkillDetails.useCases.map((useCase) => (
                          <li key={useCase} className="flex gap-2">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                            <span>{useCase}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-200/80">Related Tools</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {activeSkillDetails.relatedTools.map((tool) => (
                          <span
                            key={tool}
                            className="inline-flex rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs font-medium text-slate-200"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
