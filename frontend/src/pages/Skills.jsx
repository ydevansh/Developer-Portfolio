import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { HiOutlineCodeBracket, HiOutlineCpuChip, HiOutlineSquares2X2 } from 'react-icons/hi2';
import {
  SiC,
  SiGit,
  SiJavascript,
  SiMongodb,
  SiMysql,
  SiNodedotjs,
  SiNumpy,
  SiPandas,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiTensorflow,
} from 'react-icons/si';
import skillService from '../services/skillService';

const fallbackSkills = {
  'AI & Data Science': ['Python', 'Machine Learning', 'Data Analysis', 'Pandas', 'NumPy'],
  'Web Development': ['React', 'JavaScript', 'Tailwind CSS', 'Node.js', 'Git', 'MongoDB'],
  Languages: ['Python', 'JavaScript', 'C', 'SQL'],
};

const themePalette = [
  {
    titleClass: 'from-blue-300 to-cyan-300',
    badgeClass:
      'bg-blue-500/20 text-blue-100 border border-blue-400/35 hover:bg-blue-500/30 hover:border-blue-300/45',
    glowClass: 'from-blue-500/20 via-transparent to-cyan-500/20',
    icon: HiOutlineCpuChip,
  },
  {
    titleClass: 'from-fuchsia-300 to-violet-300',
    badgeClass:
      'bg-violet-500/20 text-violet-100 border border-violet-400/35 hover:bg-violet-500/30 hover:border-violet-300/45',
    glowClass: 'from-fuchsia-500/20 via-transparent to-violet-500/20',
    icon: HiOutlineSquares2X2,
  },
  {
    titleClass: 'from-cyan-300 to-sky-300',
    badgeClass:
      'bg-cyan-500/20 text-cyan-100 border border-cyan-400/35 hover:bg-cyan-500/30 hover:border-cyan-300/45',
    glowClass: 'from-cyan-500/20 via-transparent to-sky-500/20',
    icon: HiOutlineCodeBracket,
  },
];

const skillIconMap = {
  python: SiPython,
  'machine learning': SiTensorflow,
  react: SiReact,
  javascript: SiJavascript,
  'tailwind css': SiTailwindcss,
  'node.js': SiNodedotjs,
  git: SiGit,
  pandas: SiPandas,
  numpy: SiNumpy,
  mongodb: SiMongodb,
  c: SiC,
  sql: SiMysql,
};

const pickTheme = (category, index) => {
  const lower = category.toLowerCase();
  if (lower.includes('ai') || lower.includes('data')) return themePalette[0];
  if (lower.includes('web') || lower.includes('front') || lower.includes('back')) return themePalette[1];
  if (lower.includes('lang') || lower.includes('program')) return themePalette[2];
  return themePalette[index % themePalette.length];
};

const getSkillIcon = (name) => {
  const lower = name.toLowerCase();
  const direct = skillIconMap[lower];
  if (direct) return direct;

  const key = Object.keys(skillIconMap).find((item) => lower.includes(item));
  return key ? skillIconMap[key] : null;
};

export default function Skills() {
  const [skills, setSkills] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await skillService.getAllSkills();
        const groupedSkills = {};

        response.data.skills.forEach((skill) => {
          if (!groupedSkills[skill.category]) {
            groupedSkills[skill.category] = [];
          }
          groupedSkills[skill.category].push({
            _id: skill._id,
            name: skill.name,
            proficiency: skill.proficiency,
          });
        });

        setSkills(groupedSkills);
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const displaySkills = Object.keys(skills).length ? skills : fallbackSkills;

  if (loading) {
    return (
      <div className="pt-32 pb-20 px-4 text-center">
        <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-3">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-300" />
          <span className="text-gray-300">Loading skills...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden pt-32 pb-20">
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
              My Skills
            </h1>
            <p className="mt-4 text-gray-300 text-lg">Technologies and tools I use to bring ideas to life</p>
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-7">
            {Object.entries(displaySkills).map(([category, categorySkills], index) => {
              const theme = pickTheme(category, index);
              const SectionIcon = theme.icon;

              return (
                <motion.article
                  key={category}
                  whileHover={{ y: -8, scale: 1.01 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/45 p-7"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${theme.glowClass}`} />

                  <div className="relative">
                    <div className="flex items-center gap-3">
                      <SectionIcon className="text-4xl text-cyan-300" />
                      <h2
                        className={`text-4xl lg:text-3xl font-bold bg-gradient-to-r ${theme.titleClass} bg-clip-text text-transparent`}
                      >
                        {category}
                      </h2>
                    </div>

                    <div className="mt-7 flex flex-wrap gap-3">
                      {categorySkills.map((entry) => {
                        const name = typeof entry === 'string' ? entry : entry.name;
                        const proficiency = typeof entry === 'string' ? null : entry.proficiency;
                        const SkillIcon = getSkillIcon(name);

                        return (
                          <span
                            key={typeof entry === 'string' ? entry : entry._id || `${category}-${entry.name}`}
                            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all duration-300 ${theme.badgeClass}`}
                          >
                            {SkillIcon && <SkillIcon className="text-base" />}
                            <span>{name}</span>
                            {proficiency && (
                              <span className="rounded-md bg-black/20 px-1.5 py-0.5 text-[10px] uppercase tracking-[0.12em]">
                                {proficiency}
                              </span>
                            )}
                          </span>
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
    </div>
  );
}
