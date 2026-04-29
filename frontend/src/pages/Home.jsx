import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaGraduationCap, FaWhatsapp } from 'react-icons/fa';
import { HiOutlineCpuChip } from 'react-icons/hi2';
import { SiPython, SiReact } from 'react-icons/si';
import profileImage from '../assets/profile.jpg';
import Seo from '../components/Seo';
import skillService from '../services/skillService';
import { generatedProjects } from '../data/portfolioContent';
import { fallbackBlogArticles } from '../data/blogArticles';
import {
  defaultSkillSeeds,
  groupSkillsByCategory,
  resolveSkillIcon,
  skillCategoryMeta,
  skillCategoryOrder,
} from '../data/skillCatalog';

const homeSeo = {
  title: 'Devansh Yadav Portfolio - AI/ML Developer and Web Developer in Lucknow',
  description:
    'Devansh Yadav is an AI/ML Developer and Web Developer from Lucknow, studying at Babu Banarasi Das University (BBDU). Explore projects, skills, blogs, and contact details.',
  keywords: [
    'Devansh Yadav portfolio',
    'Devansh Lucknow',
    'Devansh BBD',
    'AI/ML Developer',
    'Web Developer',
    'AI engineer',
    'BBDU',
    'Babu Banarasi Das University',
    'Lucknow',
    'React developer',
    'Node.js developer',
    'Python developer',
    'portfolio',
  ],
};

const blogDescriptionClamp = {
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden',
};

const blogPreview = [...fallbackBlogArticles]
  .sort((left, right) => {
    const featuredOrder = Number(Boolean(right.featured)) - Number(Boolean(left.featured));
    if (featuredOrder !== 0) return featuredOrder;

    return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();
  })
  .slice(0, 3)
  .map((blog) => ({
    title: blog.title,
    description:
      blog.description.length > 120 ? `${blog.description.slice(0, 120).trim()}...` : blog.description,
    category: blog.category,
    slug: blog.slug,
  }));

export default function Home() {
  const [skillEntries, setSkillEntries] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchSkills = async () => {
      try {
        const response = await skillService.getAllSkills();
        const apiSkills = Array.isArray(response?.data?.skills) ? response.data.skills : [];

        if (isMounted) {
          setSkillEntries(apiSkills.length > 0 ? apiSkills : defaultSkillSeeds);
        }
      } catch (error) {
        if (isMounted) {
          setSkillEntries(defaultSkillSeeds);
        }
      }
    };

    fetchSkills();

    return () => {
      isMounted = false;
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const groupedSkills = useMemo(() => groupSkillsByCategory(skillEntries.length ? skillEntries : defaultSkillSeeds), [skillEntries]);

  const skillGroups = skillCategoryOrder.map((category) => ({
    category,
    ...skillCategoryMeta[category],
    items: groupedSkills[category] || [],
  }));

  const experiencePreview = [
    {
      title: 'BCA Program',
      subtitle: 'Babu Banarasi Das University, Lucknow (2024-2027)',
      description:
        'Bachelor of Computer Applications focused on software fundamentals, programming, and practical project building.',
      naacText: 'NAAC rank/grade details (official reports)',
      naacLink: 'https://bbdu.ac.in/data/disclosure/NAAC-Reports/',
    },
    {
      title: 'AI Minor Program',
      subtitle: 'IIT Mandi (Online)',
      description: 'Building a strong base in AI concepts and practical implementation.',
    },
    {
      title: 'Full Stack Projects',
      subtitle: 'Hands-on Development',
      description: 'Creating end-to-end web apps with modern frontend and backend tools.',
    },
    {
      title: 'Continuous Learning',
      subtitle: 'Daily Practice',
      description: 'Improving coding, system thinking, and real-world problem solving.',
    },
  ];

  const projectPreview = generatedProjects.slice(0, 3).map((project) => ({
    title: project.title,
    description:
      project.shortDescription.length > 130
        ? `${project.shortDescription.slice(0, 130).trim()}...`
        : project.shortDescription,
    image: project.imageUrl,
    technologies: project.technologies.slice(0, 3),
    githubLink: project.githubLink,
    liveDemoLink: project.liveDemoLink,
  }));

  const heroHighlights = [
    {
      label: 'Python Developer',
      icon: SiPython,
      borderClass: 'from-sky-500 via-cyan-400 to-blue-500',
      iconClass: 'from-sky-500 via-cyan-400 to-blue-500',
    },
    {
      label: 'AI & Data Science',
      icon: HiOutlineCpuChip,
      borderClass: 'from-violet-500 via-fuchsia-500 to-purple-500',
      iconClass: 'from-violet-500 via-fuchsia-500 to-purple-500',
    },
    {
      label: 'Full Stack Developer',
      icon: SiReact,
      borderClass: 'from-cyan-500 via-sky-500 to-indigo-500',
      iconClass: 'from-cyan-500 via-sky-500 to-indigo-500',
    },
  ];

  return (
    <div className="relative overflow-hidden pt-28 pb-12 lg:pt-32 lg:pb-16">
      <Seo
        title={homeSeo.title}
        description={homeSeo.description}
        keywords={homeSeo.keywords}
        canonicalPath="/"
        image={profileImage}
        imageAlt="Devansh Yadav profile portrait"
      />

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 left-[-10rem] h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute top-16 right-[-10rem] h-96 w-96 rounded-full bg-fuchsia-500/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.14),transparent_30%),radial-gradient(circle_at_82%_10%,rgba(168,85,247,0.16),transparent_28%),radial-gradient(circle_at_50%_90%,rgba(59,130,246,0.1),transparent_34%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.section
          className="grid items-center gap-8 lg:grid-cols-[1.08fr_0.92fr]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="space-y-5">
            <div className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-200 shadow-[0_0_30px_rgba(34,211,238,0.12)] backdrop-blur-sm">
              Welcome to my portfolio
            </div>

            <div className="space-y-3.5">
              <motion.h1
                className="font-heading text-4xl font-extrabold leading-[0.9] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl xl:text-6xl"
                variants={itemVariants}
              >
                <span className="block text-white/92 drop-shadow-[0_0_24px_rgba(255,255,255,0.08)]">
                  Devansh
                </span>
                <span className="block bg-gradient-to-r from-sky-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
                  Yadav
                </span>
              </motion.h1>

              <motion.p variants={itemVariants} className="text-lg font-semibold text-slate-100 sm:text-xl">
                AI/ML Developer and Web Developer in Lucknow
              </motion.p>

              <motion.p variants={itemVariants} className="max-w-lg text-sm leading-6 text-slate-300 sm:text-[15px]">
                I&apos;m Devansh Yadav, a BCA student at Babu Banarasi Das University (BBDU) in Lucknow, building AI/ML
                and full stack projects with React, Node.js, Python, MongoDB, and SQL.
              </motion.p>
            </div>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
              {heroHighlights.map((item) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.label}
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className={`rounded-2xl bg-gradient-to-r ${item.borderClass} p-[1px] shadow-[0_12px_30px_rgba(15,23,42,0.22)]`}
                  >
                    <div className="flex items-center gap-3 rounded-[15px] border border-white/10 bg-slate-950/80 px-3 py-2 backdrop-blur-xl">
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-r ${item.iconClass} text-white shadow-[0_10px_18px_rgba(34,211,238,0.2)]`}
                      >
                        <Icon size={15} />
                      </span>
                      <span className="text-[12px] font-semibold text-slate-100 sm:text-sm">{item.label}</span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-slate-200 backdrop-blur-sm sm:text-sm"
            >
              <FaGraduationCap className="text-cyan-300" size={13} />
              <span>BCA Student at Babu Banarasi Das University (BBDU), Lucknow</span>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-200 shadow-[0_0_24px_rgba(16,185,129,0.16)] sm:text-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.85)] animate-pulse" />
              Open for Internships &amp; Freelance
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-2.5 pt-1">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(99,102,241,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(34,211,238,0.32)]"
              >
                Book Service
                <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" size={14} />
              </Link>

              <Link
                to="/projects"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-100 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-cyan-500/10"
              >
                View Projects
              </Link>

              <a
                href="https://wa.me/916388525760?text=Hello%20Devansh%2C%20I%20want%20to%20connect%20about%20a%20project"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-transparent px-4 py-2.5 text-sm font-semibold text-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/40 hover:bg-emerald-500/10 hover:text-emerald-100"
              >
                <FaWhatsapp size={14} />
                Contact Me
              </a>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="hidden items-center gap-3 pt-2 text-[10px] uppercase tracking-[0.28em] text-slate-400 lg:flex"
            >
              <span>Scroll Down</span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="flex h-9 w-6 justify-center rounded-full border border-white/15 bg-white/5 p-1"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants} className="relative flex justify-center lg:justify-end">
            <div className="relative aspect-square w-full max-w-[20rem] sm:max-w-[22rem] lg:max-w-[24rem]">
              <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-3xl scale-100" />
              <div className="absolute inset-5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm" />
              <motion.div
                className="relative z-10 h-full w-full rounded-full bg-gradient-to-br from-cyan-400 via-violet-500 to-fuchsia-500 p-1.5 shadow-[0_18px_50px_rgba(99,102,241,0.26)]"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="h-full w-full overflow-hidden rounded-full border border-white/20 bg-slate-950">
                  <img
                    src={profileImage}
                    alt="Devansh Yadav portrait"
                    className="h-full w-full object-cover object-[50%_30%] scale-100 transition-transform duration-500 hover:scale-[1.03]"
                  />
                </div>
              </motion.div>

              <div className="absolute -bottom-1 right-4 z-20 inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-500 px-3 py-1 text-[10px] font-semibold text-white shadow-[0_0_18px_rgba(16,185,129,0.34)]">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                Available!
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Home Sections */}
        <motion.div
          className="mt-24 pt-16 border-t border-primary-500/20 space-y-24"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.section variants={itemVariants} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary-400 mb-2">About</p>
                <h2 className="text-3xl md:text-4xl font-bold">About Me</h2>
              </div>
              <Link
                to="/about"
                className="w-fit px-5 py-2.5 bg-primary-500/20 border border-primary-500 hover:bg-primary-500/30 rounded-lg transition-colors duration-300"
              >
                Read More
              </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <p className="text-gray-400 leading-relaxed bg-primary-500/10 border border-primary-500/20 rounded-xl p-6">
                I am an aspiring AI engineer with a strong foundation in Python and full stack development. I enjoy
                building practical applications and improving through hands-on work.
              </p>
              <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Education Snapshot</h3>
                <div className="space-y-3 text-gray-400">
                  <p>BCA (2024-2027) - Babu Banarasi Das University</p>
                  <p>AI Minor - IIT Mandi (Online)</p>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section variants={itemVariants} className="space-y-10">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a1430]/55 px-4 py-10 sm:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_35%,rgba(34,211,238,0.2),transparent_38%),radial-gradient(circle_at_80%_20%,rgba(192,132,252,0.18),transparent_38%),radial-gradient(circle_at_50%_100%,rgba(2,132,199,0.2),transparent_45%)]" />
              <div className="relative">
                <div className="text-center">
                  <p className="inline-flex rounded-full border border-violet-400/25 bg-violet-500/20 px-4 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-violet-200">
                    WHAT I KNOW
                  </p>
                  <h2 className="mt-4 text-3xl font-bold bg-gradient-to-r from-fuchsia-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent md:text-4xl">
                    My Skills
                  </h2>
                  <p className="mt-3 text-sm text-gray-300 sm:text-base">
                    Technologies and tools I use to bring ideas to life
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
                  {skillGroups.map((group) => {
                    const SectionIcon = group.icon;
                    return (
                      <motion.article
                        key={group.category}
                        whileHover={{ y: -6, scale: 1.01 }}
                        transition={{ duration: 0.28, ease: 'easeOut' }}
                        className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/45 p-5 backdrop-blur-xl"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${group.glowClass}`} />
                        <div className="relative">
                          <div className="flex items-center gap-3">
                            <SectionIcon className="text-3xl text-cyan-300" />
                            <h3
                              className={`text-2xl font-bold bg-gradient-to-r ${group.titleClass} bg-clip-text text-transparent sm:text-[1.7rem]`}
                            >
                              {group.category}
                            </h3>
                          </div>

                          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {group.items.map((skill) => {
                              const SkillIcon = resolveSkillIcon(skill);

                              return (
                                <span
                                  key={skill._id || `${group.category}-${skill.name}`}
                                  className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-300 sm:text-sm ${group.badgeClass}`}
                                >
                                  {SkillIcon && <SkillIcon className="text-sm" />}
                                  {skill.name}
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
                    to="/skills"
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(56,189,248,0.35)] transition-transform duration-300 hover:scale-[1.02] sm:px-7 sm:py-3.5 sm:text-base"
                  >
                    View All Skills & Expertise <FaArrowRight size={17} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section variants={itemVariants} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary-400 mb-2">Experience</p>
                <h2 className="text-3xl md:text-4xl font-bold">Learning Journey</h2>
              </div>
              <Link
                to="/experience"
                className="w-fit px-5 py-2.5 bg-primary-500/20 border border-primary-500 hover:bg-primary-500/30 rounded-lg transition-colors duration-300"
              >
                View Experience
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {experiencePreview.map((item) => (
                <div
                  key={item.title}
                  className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-6 hover:border-primary-500/40 transition-colors duration-300"
                >
                  <p className="text-sm text-primary-400 mb-2">{item.subtitle}</p>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.description}</p>
                  {item.naacText && item.naacLink && (
                    <a
                      href={item.naacLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 text-sm text-cyan-300 hover:text-cyan-200 underline underline-offset-4"
                    >
                      {item.naacText}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section variants={itemVariants} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary-400 mb-2">Projects</p>
                <h2 className="text-3xl md:text-4xl font-bold">Featured Projects</h2>
              </div>
              <Link
                to="/projects"
                className="w-fit px-5 py-2.5 bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors duration-300"
              >
                Explore Projects
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              {projectPreview.map((project) => (
                <div
                  key={project.title}
                  className="group overflow-hidden bg-primary-500/10 border border-primary-500/20 rounded-2xl hover:border-primary-500/45 hover:translate-y-[-4px] transition-all duration-300"
                >
                  {project.image && (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="p-5">
                    <h3 className="text-2xl md:text-xl font-semibold mb-2.5 leading-tight">{project.title}</h3>
                    <p className="text-gray-400 leading-relaxed text-sm mb-3.5">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
                        <span
                          key={`${project.title}-${tech}`}
                          className="px-2.5 py-0.5 rounded-full bg-primary-500/20 text-primary-100 text-xs border border-primary-400/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 rounded-lg text-center font-medium bg-primary-500/20 border border-primary-500/35 hover:bg-primary-500/30 transition-colors duration-300"
                      >
                        Code
                      </a>
                      <a
                        href={project.liveDemoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 rounded-lg text-center font-medium bg-gradient-to-r from-violet-500 to-cyan-500 hover:brightness-110 transition-all duration-300"
                      >
                        Demo
                      </a>
                    </div>
                  </div>
                </div>
              ))}

              <div className="rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-500 p-5 flex items-center justify-center text-center min-h-[360px]">
                <div>
                  <h3 className="text-3xl font-bold mb-2">View All Projects</h3>
                  <p className="text-white/90 mb-5">See more of my work</p>
                  <Link
                    to="/projects"
                    className="inline-flex items-center gap-2 rounded-lg bg-white/20 border border-white/35 px-4 py-2 font-medium hover:bg-white/30 transition-colors duration-300"
                  >
                    Explore <FaArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section variants={itemVariants} className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary-400 mb-2">Blog</p>
                <h2 className="text-3xl md:text-4xl font-bold">Latest Blogs</h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-400">
                  A small preview of recent writing on AI, web development, and practical project building.
                </p>
              </div>
              <Link
                to="/blog"
                className="w-fit rounded-lg border border-primary-500/40 bg-primary-500/20 px-4 py-2.5 text-sm font-medium transition-colors duration-300 hover:bg-primary-500/30"
              >
                View All Blogs
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {blogPreview.map((blog) => (
                <motion.article
                  key={blog.slug}
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-950/70 via-blue-950/35 to-slate-900/70 p-5 shadow-[0_18px_35px_rgba(2,6,23,0.35)] transition-colors duration-300 hover:border-cyan-400/35"
                >
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_55%)]" />
                  </div>

                  <div className="relative flex h-full flex-col">
                    <span className="inline-flex w-fit rounded-full border border-cyan-300/30 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-100">
                      {blog.category}
                    </span>

                    <div className="mt-4 space-y-2">
                      <h3 className="text-xl font-semibold leading-snug text-white">{blog.title}</h3>
                      <p className="text-sm leading-6 text-gray-300" style={blogDescriptionClamp}>
                        {blog.description}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3">
                      <span className="text-xs text-gray-400">Read the full article</span>
                      <Link
                        to={`/blog/${blog.slug}`}
                        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-sm font-semibold text-slate-100 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-white"
                      >
                        Read More
                        <FaArrowRight size={11} />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
}
