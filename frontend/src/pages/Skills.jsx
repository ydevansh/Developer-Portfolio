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
    <div className="relative overflow-x-hidden pt-32 pb-20">
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
          <div className="font-mono inline-flex items-center gap-3 border border-[#00E5FF]/30 bg-[#00E5FF]/5 px-5 py-3" style={{ borderRadius: '0px' }}>
            <span className="h-2.5 w-2.5 animate-pulse bg-[#00E5FF]" />
            <span className="text-[#00E5FF]">$ loading skills...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="border border-[#00E5FF]/20 bg-black/80 px-4 py-12 sm:p-10 backdrop-blur-xl"
              style={{ borderRadius: '0px' }}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
            >
              {/* Terminal corner decorators */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00E5FF]/60" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00E5FF]/60" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00E5FF]/60" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00E5FF]/60" />

              <div className="text-center">
                <p
                  className="font-mono inline-flex border border-[#00E5FF]/30 bg-[#00E5FF]/5 px-5 py-2 text-xs font-semibold tracking-[0.2em] text-[#00E5FF]"
                  style={{ borderRadius: '0px' }}
                >
                  $ cat skills.json
                </p>
                <h1 className="font-mono mt-5 text-4xl md:text-5xl font-bold text-white">
                  AI/ML <span className="text-[#00E5FF]">&</span> Web Dev Skills
                </h1>
                <p className="font-mono mt-4 text-[#A1A1AA] text-lg">Technologies and tools I use to build AI/ML and full stack web apps</p>
              </div>

              <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-3">
                {skillCategoryOrder.map((category) => {
                  const theme = skillCategoryMeta[category];
                  const SectionIcon = theme.icon;
                  const categorySkills = displaySkills[category] || [];

                  return (
                    <motion.article
                      key={category}
                      whileHover={{ y: -4, scale: 1.005 }}
                      transition={{ duration: 0.28, ease: 'easeOut' }}
                      className="relative overflow-hidden border border-[#00E5FF]/20 bg-black/60 p-5"
                      style={{ borderRadius: '0px' }}
                    >
                      {/* Faint top accent line */}
                      <div className="absolute inset-x-0 top-0 h-px bg-[#00E5FF]/30" />

                      <div className="relative">
                        <div className="flex items-center gap-3 mb-5">
                          <SectionIcon className="text-2xl text-[#00E5FF]" />
                          <h2 className="font-mono text-xl font-bold text-white">
                            {category}
                          </h2>
                        </div>

                        <div className="space-y-2">
                          {categorySkills.map((entry) => {
                            const SkillIcon = resolveSkillIcon(entry);
                            const isSelected = selectedSkill?._id ? selectedSkill._id === entry._id : selectedSkill?.name === entry.name;

                            return (
                              <motion.button
                                key={entry._id || `${category}-${entry.name}`}
                                type="button"
                                onClick={() => setSelectedSkill(entry)}
                                whileHover={{ x: 2 }}
                                whileTap={{ scale: 0.99 }}
                                className={`flex w-full items-center gap-3 border px-4 py-2.5 text-left transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#00E5FF]/50 ${
                                  isSelected
                                    ? 'border-[#00E5FF]/60 bg-[#00E5FF]/10 shadow-[0_0_16px_rgba(0,229,255,0.1)]'
                                    : 'border-white/10 bg-white/[0.02] hover:border-[#00E5FF]/40 hover:bg-[#00E5FF]/5'
                                }`}
                                style={{ borderRadius: '0px' }}
                              >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-white/10 bg-black/30 text-white/90">
                                  {SkillIcon && (
                                    <SkillIcon className="text-sm" />
                                  )}
                                </div>

                                <span className="font-mono min-w-0 break-words text-sm font-semibold leading-snug text-white sm:text-[15px]">
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
                  className="font-mono inline-flex items-center gap-2 border border-[#00E5FF]/60 px-8 py-4 text-base font-semibold text-[#00E5FF] transition-all duration-300 hover:bg-[#00E5FF] hover:text-black"
                  style={{ borderRadius: '0px' }}
                >
                  &gt; View Projects Built With These Skills <FaArrowRight size={14} />
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
                  className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 18 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 18 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="relative z-10 w-full max-w-2xl overflow-hidden border border-[#00E5FF]/30 bg-black shadow-[0_30px_80px_rgba(0,229,255,0.05)]"
                  style={{ borderRadius: '0px' }}
                >
                  {/* Top accent */}
                  <div className="absolute inset-x-0 top-0 h-px bg-[#00E5FF]/60" />
                  {/* Corner decorators */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00E5FF]/60" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#00E5FF]/60" />

                  <div className="relative p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span
                          className="font-mono inline-flex border border-[#00E5FF]/30 bg-[#00E5FF]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#00E5FF]"
                          style={{ borderRadius: '0px' }}
                        >
                          {activeSkillDetails.category}
                        </span>
                        <h3 className="font-mono mt-3 text-2xl font-bold text-white sm:text-3xl">{activeSkillDetails.name}</h3>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-[#A1A1AA]">{activeSkillDetails.description}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedSkill(null)}
                        className="border border-[#00E5FF]/20 bg-black/50 p-2 text-[#A1A1AA] transition-colors hover:border-[#00E5FF]/50 hover:text-[#00E5FF]"
                        style={{ borderRadius: '0px' }}
                        aria-label="Close modal"
                      >
                        <FaTimes size={14} />
                      </button>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="border border-[#00E5FF]/15 bg-[#00E5FF]/[0.02] p-4 sm:col-span-2" style={{ borderRadius: '0px' }}>
                        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#00E5FF]/70">
                          Used in this portfolio
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[#A1A1AA]">{activeSkillDetails.portfolioUse}</p>
                      </div>
                    </div>

                    <div className="mt-4 border border-[#00E5FF]/15 bg-[#00E5FF]/[0.02] p-4" style={{ borderRadius: '0px' }}>
                      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#00E5FF]/70">Use Cases</p>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-[#A1A1AA]">
                        {activeSkillDetails.useCases.map((useCase) => (
                          <li key={useCase} className="flex gap-2">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#00E5FF]" />
                            <span>{useCase}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 border border-[#00E5FF]/15 bg-[#00E5FF]/[0.02] p-4" style={{ borderRadius: '0px' }}>
                      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#00E5FF]/70">Related Tools</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {activeSkillDetails.relatedTools.map((tool) => (
                          <span
                            key={tool}
                            className="font-mono inline-flex border border-[#00E5FF]/20 bg-[#00E5FF]/5 px-3 py-1 text-xs font-medium text-[#00E5FF]"
                            style={{ borderRadius: '0px' }}
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
