import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaArrowRight,
  FaGraduationCap,
  FaWhatsapp,
  FaFire,
  FaLightbulb,
  FaCode,
  FaRocket,
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaTwitter,
  FaEnvelope,
} from 'react-icons/fa';
import { HiOutlineCpuChip } from 'react-icons/hi2';
import { SiLeetcode, SiPython, SiReact } from 'react-icons/si';
import profileImage from '../assets/profile.jpg';
import Seo from '../components/Seo';
import skillService from '../services/skillService';
import { generatedProjects } from '../data/portfolioContent';
import { fallbackBlogArticles } from '../data/blogArticles';
import { buildBreadcrumbSchema } from '../data/seoSchemas';
import {
  defaultSkillSeeds,
  groupSkillsByCategory,
  resolveSkillIcon,
  skillCategoryMeta,
  skillCategoryOrder,
} from '../data/skillCatalog';

const homeSeo = {
  title: 'Devansh Yadav Portfolio | Python Developer, MERN Stack Developer & AI Student in Lucknow',
  description:
    'Devansh Yadav, also known as Deva Yadav, is a Python Developer, MERN Stack Developer, and AI & Data Science learner from Lucknow. Explore projects, skills, blog posts, and contact details.',
  keywords: [
    'Devansh Yadav portfolio',
    'Deva Yadav',
    'Devansh Lucknow',
    'Devansh Yadav Developer',
    'Python Developer',
    'MERN Stack Developer',
    'Full Stack Developer',
    'React Developer',
    'Node.js Developer',
    'AI Developer',
    'Machine Learning Developer',
    'Data Science Student',
    'BCA Student',
    'BBDU',
    'Babu Banarasi Das University',
    'Lucknow',
    'Developer in Lucknow',
    'Portfolio Website',
    'Full Stack Developer Portfolio',
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

const MotionLink = motion(Link);

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
      id: 'bca',
      title: 'BCA Program',
      subtitle: 'Babu Banarasi Das University, Lucknow',
      period: '2024-2027',
      summary: 'Bachelor of Computer Applications focused on software foundations, programming, and practical project work.',
      chips: ['Software basics', 'Project work', 'NAAC reports'],
      linkText: 'NAAC official reports',
      linkHref: 'https://bbdu.ac.in/data/disclosure/NAAC-Reports/',
      icon: FaGraduationCap,
      accent: 'from-cyan-400 via-blue-500 to-indigo-500',
    },
    {
      id: 'ai-minor',
      title: 'AI Minor Program',
      subtitle: 'IIT Mandi (Online)',
      period: 'Ongoing',
      summary: 'Building a strong base in AI concepts with practical implementation and guided learning.',
      chips: ['AI concepts', 'Practical labs', 'Applied learning'],
      icon: FaLightbulb,
      accent: 'from-violet-400 via-fuchsia-500 to-purple-500',
    },
    {
      id: 'projects',
      title: 'Full Stack Projects',
      subtitle: 'Hands-on Development',
      period: 'Build mode',
      summary: 'Creating end-to-end web apps with modern frontend and backend tools.',
      chips: ['React UI', 'Node backend', 'APIs'],
      icon: FaCode,
      accent: 'from-emerald-400 via-teal-500 to-cyan-500',
    },
    {
      id: 'learning',
      title: 'Continuous Learning',
      subtitle: 'Daily Practice',
      period: 'Every day',
      summary: 'Improving coding, system thinking, and real-world problem solving through steady practice.',
      chips: ['Problem solving', 'Consistency', 'Growth mindset'],
      icon: FaFire,
      accent: 'from-amber-400 via-orange-500 to-rose-500',
    },
  ];

  const projectPreview = generatedProjects.slice(0, 3).map((project) => ({
    title: project.title,
    description: project.shortDescription || '',
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

  const homeStructuredData = {
    ...buildBreadcrumbSchema([{ name: 'Home', path: '/' }], '/'),
  };

  const socialLinks = [
    { label: 'GitHub', icon: FaGithub, href: 'https://github.com/ydevansh' },
    { label: 'LinkedIn', icon: FaLinkedin, href: 'https://www.linkedin.com/in/ydevansh/' },
    { label: 'LeetCode', icon: SiLeetcode, href: 'https://leetcode.com/u/ydevansh/' },
    { label: 'Instagram', icon: FaInstagram, href: 'https://www.instagram.com/codewithdeva/' },
    { label: 'Twitter', icon: FaTwitter, href: 'https://x.com/yxdevansh' },
  ];

  return (
    <div className="relative overflow-x-hidden pt-28 pb-12 lg:pt-32 lg:pb-16 bg-transparent">
      <Seo
        title={homeSeo.title}
        description={homeSeo.description}
        keywords={homeSeo.keywords}
        canonicalPath="/"
        image={profileImage}
        imageAlt="Devansh Yadav profile portrait"
        structuredData={homeStructuredData}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.section
          className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* ── LEFT COLUMN ── */}
          <motion.div variants={itemVariants} className="space-y-5">

            {/* Terminal welcome prompt */}
            <div className="mt-4 inline-flex items-center gap-2 border border-[#00E5FF]/40 px-3 py-1 text-[10px] font-mono font-semibold uppercase tracking-[0.22em] text-[#00E5FF] sm:mt-0">
              <span className="opacity-60">$</span> welcome --portfolio
            </div>

            <div className="space-y-4">
              <motion.h1
                className="font-heading text-4xl font-extrabold leading-[0.9] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl xl:text-6xl"
                variants={itemVariants}
              >
                <span className="block text-white">Devansh</span>
                <span className="block text-white">Yadav</span>
              </motion.h1>

              <motion.p variants={itemVariants} className="font-mono text-[13px] font-semibold text-[#00E5FF] sm:text-sm tracking-wider">
                Python Developer, MERN Developer &amp; Data Science Learner
              </motion.p>

              {/* Mobile portrait — circle restored, grayscale + cyan ring */}
              <motion.div variants={itemVariants} className="mx-auto mt-4 w-full max-w-[13rem] lg:hidden">
                <div className="relative aspect-square w-full">
                  {/* Glow behind circle */}
                  <div className="absolute inset-0 rounded-full bg-[#4F46E5]/10 blur-2xl scale-110" />
                  {/* Cyan ring + circle clip */}
                  <div className="relative z-10 h-full w-full rounded-full border border-[#00E5FF]/30 p-0.5 shadow-[0_0_22px_rgba(0,229,255,0.12)]">
                    <div className="h-full w-full rounded-full overflow-hidden bg-[#000000]">
                      <img
                        id="hero-profile-image-mobile"
                        src={profileImage}
                        alt="Devansh Yadav portrait"
                        className="h-full w-full object-cover object-[50%_30%]"
                        style={{ filter: 'grayscale(100%) contrast(110%)' }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.p variants={itemVariants} className="max-w-lg text-sm leading-6 text-[#A1A1AA] sm:text-[15px]">
                I&apos;m Devansh Yadav, a BCA student at Babu Banarasi Das University (BBDU) in Lucknow, building AI, data science
                and full stack projects with React, Node.js, Python, MongoDB, and SQL.
              </motion.p>
            </div>

            {/* Skill badges — terminal style, uniform cyan, sharp corners */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
              {heroHighlights.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="border border-[#00E5FF]/35 bg-transparent px-3 py-1.5 flex items-center gap-2 hover:border-[#00E5FF]/70 hover:bg-[#00E5FF]/5 transition-all duration-200"
                  >
                    <Icon size={12} className="text-[#00E5FF] flex-shrink-0" />
                    <span className="font-mono text-[11px] font-medium text-[#00E5FF] sm:text-xs tracking-wide">{item.label}</span>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* University — terminal info line */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-3 border border-white/10 px-3 py-1.5 text-[11px] font-mono font-medium text-[#A1A1AA] sm:text-xs"
            >
              <FaGraduationCap className="text-[#00E5FF] flex-shrink-0" size={12} />
              <span>BCA @ Babu Banarasi Das University (BBDU), Lucknow</span>
            </motion.div>

            {/* Availability status */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 border border-[#00E5FF]/30 px-3 py-1.5 text-[11px] font-mono font-semibold text-[#00E5FF] sm:text-xs"
            >
              <span className="h-1.5 w-1.5 bg-[#00E5FF] animate-pulse flex-shrink-0" />
              Open for Internships &amp; Freelance
            </motion.div>

            {/* Ghost terminal buttons — strictly no border-radius */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-2.5 pt-1">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 border border-[#00E5FF] px-5 py-2.5 text-[13px] font-mono font-semibold text-[#00E5FF] transition-all duration-200 hover:bg-[#00E5FF] hover:text-[#000000]"
              >
                ./book-service
                <FaArrowRight className="transition-transform duration-200 group-hover:translate-x-1" size={12} />
              </Link>

              <Link
                to="/projects"
                className="inline-flex items-center gap-2 border border-white/20 px-5 py-2.5 text-[13px] font-mono font-semibold text-[#A1A1AA] transition-all duration-200 hover:border-[#00E5FF] hover:text-[#00E5FF]"
              >
                ./view-projects
              </Link>

              <a
                href="https://wa.me/916388525760?text=Hello%20Devansh%2C%20I%20want%20to%20connect%20about%20a%20project"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-white/15 px-5 py-2.5 text-[13px] font-mono font-semibold text-[#A1A1AA] transition-all duration-200 hover:border-[#00E5FF] hover:text-[#00E5FF]"
              >
                <FaWhatsapp size={13} />
                ./contact-me
              </a>
            </motion.div>

            {/* Social links — mobile, square icon boxes */}
            <motion.div variants={itemVariants} className="flex items-center gap-3 md:hidden">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-[#A1A1AA]">Connect</span>
              <div className="flex items-center gap-2">
                {socialLinks.map(({ label, icon: Icon, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-8 w-8 items-center justify-center border border-white/15 text-[#A1A1AA] transition-all duration-200 hover:border-[#00E5FF] hover:text-[#00E5FF]"
                  >
                    <Icon size={13} />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Scroll indicator — terminal style */}
            <motion.div
              variants={itemVariants}
              className="hidden items-center gap-3 pt-2 font-mono text-[10px] uppercase tracking-[0.28em] text-[#A1A1AA] lg:flex"
            >
              <span>Scroll Down</span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="flex h-9 w-5 justify-center border border-white/15 bg-transparent p-1"
              >
                <span className="h-1.5 w-1.5 bg-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.7)]" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* ── RIGHT COLUMN: Circle portrait, cyan ring, grayscale ── */}
          <motion.div variants={itemVariants} className="relative hidden justify-center lg:flex lg:justify-end">
            <div className="relative w-full max-w-[20rem] sm:max-w-[22rem] lg:max-w-[24rem]">
              <motion.div
                className="relative aspect-square w-full"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* Glow behind circle */}
                <div className="absolute inset-0 rounded-full bg-[#4F46E5]/12 blur-3xl scale-110" />
                {/* Outer cyan ring */}
                <div className="relative z-10 h-full w-full rounded-full border border-[#00E5FF]/30 p-1 shadow-[0_0_32px_rgba(0,229,255,0.13)]">
                  {/* Circle-clipped grayscale portrait */}
                  <div className="h-full w-full rounded-full overflow-hidden bg-[#000000]">
                    <img
                      id="hero-profile-image-desktop"
                      src={profileImage}
                      alt="Devansh Yadav portrait"
                      className="h-full w-full object-cover object-[50%_30%]"
                      style={{ filter: 'grayscale(100%) contrast(110%)' }}
                    />
                  </div>
                </div>
                {/* Status badge — terminal style */}
                <div className="absolute -bottom-5 left-0 z-20">
                  <div className="inline-flex items-center gap-2 border border-[#00E5FF]/50 bg-[#000000] px-3 py-1.5 text-[10px] font-mono font-semibold text-[#00E5FF]">
                    <span className="h-1.5 w-1.5 bg-[#00E5FF] animate-pulse" />
                    STATUS: AVAILABLE
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.section>

        {/* Home Sections */}
        <motion.div
          className="mt-20 pt-12 border-t border-[#00E5FF]/15 space-y-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* About Me Section */}
          <motion.section variants={itemVariants} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <div
                  className="font-mono inline-flex items-center gap-2 border border-[#00E5FF]/30 bg-[#00E5FF]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#00E5FF] mb-2"
                  style={{ borderRadius: '0px' }}
                >
                  <span className="h-1.5 w-1.5 bg-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.8)] animate-pulse" />
                  $ cat about.md
                </div>
                <h2 className="font-sans text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                  Who <span className="text-[#00E5FF]">I Am</span>
                </h2>
              </div>
              <Link
                to="/about"
                className="font-mono inline-flex items-center gap-2 border border-[#00E5FF]/60 px-4 py-2 text-xs font-semibold text-[#00E5FF] transition-all duration-300 hover:bg-[#00E5FF] hover:text-black"
                style={{ borderRadius: '0px' }}
              >
                Read more <FaArrowRight size={12} />
              </Link>
            </div>

            <div
              className="relative overflow-hidden border border-[#00E5FF]/20 bg-black/80 p-6 sm:p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              style={{ borderRadius: '0px' }}
            >
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#00E5FF]/60" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#00E5FF]/60" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#00E5FF]/60" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#00E5FF]/60" />

              <div className="relative z-10 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center border border-[#00E5FF]/40 bg-[#00E5FF]/10 text-[#00E5FF]">
                      <FaLightbulb className="text-lg" />
                    </div>
                    <h3 className="font-sans text-xl font-bold sm:text-2xl text-white">Passionate Developer</h3>
                  </div>

                  <p className="font-sans text-sm sm:text-base leading-relaxed text-gray-300">
                    I&apos;m a <span className="font-semibold text-[#00E5FF]">BCA student at Babu Banarasi Das University</span> focused on AI, data science, and full-stack development. I like turning ideas into practical, clean solutions.
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className="font-mono inline-flex items-center gap-2 border border-[#00E5FF]/20 bg-[#00E5FF]/[0.04] px-3 py-1.5 text-xs text-[#00E5FF]"
                      style={{ borderRadius: '0px' }}
                    >
                      <FaCode size={11} /> Full Stack
                    </span>
                    <span
                      className="font-mono inline-flex items-center gap-2 border border-[#00E5FF]/20 bg-[#00E5FF]/[0.04] px-3 py-1.5 text-xs text-[#00E5FF]"
                      style={{ borderRadius: '0px' }}
                    >
                      <FaRocket size={11} /> Problem Solver
                    </span>
                    <span
                      className="font-mono inline-flex items-center gap-2 border border-[#00E5FF]/20 bg-[#00E5FF]/[0.04] px-3 py-1.5 text-xs text-[#00E5FF]"
                      style={{ borderRadius: '0px' }}
                    >
                      <FaFire size={11} /> Continuous Growth
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="border border-[#00E5FF]/20 bg-white/[0.02] p-4" style={{ borderRadius: '0px' }}>
                      <p className="font-mono text-2xl font-bold text-[#00E5FF]">2024-2027</p>
                      <p className="font-sans text-xs text-gray-400 mt-1">BCA Program</p>
                    </div>
                    <div className="border border-[#00E5FF]/20 bg-white/[0.02] p-4" style={{ borderRadius: '0px' }}>
                      <p className="font-mono text-2xl font-bold text-[#00E5FF]">∞</p>
                      <p className="font-sans text-xs text-gray-400 mt-1">Always Learning</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center border border-[#00E5FF]/40 bg-[#00E5FF]/10 text-[#00E5FF]">
                      <FaGraduationCap className="text-lg" />
                    </div>
                    <h3 className="font-sans text-lg font-bold text-white">Education</h3>
                  </div>

                  <div className="border border-[#00E5FF]/20 bg-white/[0.02] p-4" style={{ borderRadius: '0px' }}>
                    <p className="font-sans text-sm font-semibold text-white">BCA Program</p>
                    <p className="font-mono mt-1 text-xs text-[#00E5FF]/80">Babu Banarasi Das University · 2024-2027</p>
                  </div>

                  <div className="border border-[#00E5FF]/20 bg-white/[0.02] p-4" style={{ borderRadius: '0px' }}>
                    <p className="font-sans text-sm font-semibold text-white">AI Minor</p>
                    <p className="font-mono mt-1 text-xs text-[#00E5FF]/80">IIT Mandi (Online)</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Skills Section */}
          <motion.section variants={itemVariants} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <div
                  className="font-mono inline-flex items-center gap-2 border border-[#00E5FF]/30 bg-[#00E5FF]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#00E5FF] mb-2"
                  style={{ borderRadius: '0px' }}
                >
                  <span className="h-1.5 w-1.5 bg-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.8)] animate-pulse" />
                  $ skills --list
                </div>
                <h2 className="font-sans text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                  Technical <span className="text-[#00E5FF]">Arsenal</span>
                </h2>
                <p className="font-sans mt-2 max-w-2xl text-sm leading-relaxed text-gray-300">
                  Technologies, frameworks, and tools I use to build scalable web apps and AI solutions.
                </p>
              </div>
              <Link
                to="/skills"
                className="font-mono inline-flex items-center gap-2 border border-[#00E5FF]/60 px-4 py-2 text-xs font-semibold text-[#00E5FF] transition-all duration-300 hover:bg-[#00E5FF] hover:text-black"
                style={{ borderRadius: '0px' }}
              >
                All skills <FaArrowRight size={12} />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {skillGroups.map((group) => {
                const SectionIcon = group.icon;
                return (
                  <article
                    key={group.category}
                    className="relative border border-[#00E5FF]/20 bg-black/80 p-5 sm:p-6 transition-all duration-300 hover:border-[#00E5FF]/50"
                    style={{ borderRadius: '0px' }}
                  >
                    <div className="flex items-center gap-3 border-b border-[#00E5FF]/15 pb-4">
                      <div className="flex h-9 w-9 items-center justify-center border border-[#00E5FF]/40 bg-[#00E5FF]/10 text-[#00E5FF]">
                        <SectionIcon className="text-lg" />
                      </div>
                      <h3 className="font-sans text-lg font-bold text-white tracking-tight">
                        {group.category}
                      </h3>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-2">
                      {group.items.map((skill) => {
                        const SkillIcon = resolveSkillIcon(skill);

                        return (
                          <span
                            key={skill._id || `${group.category}-${skill.name}`}
                            className="font-mono inline-flex items-center gap-2 border border-white/10 bg-white/[0.02] px-3 py-2 text-xs font-medium text-gray-300 transition-colors hover:border-[#00E5FF]/40 hover:text-[#00E5FF]"
                            style={{ borderRadius: '0px' }}
                          >
                            {SkillIcon && <SkillIcon className="text-xs text-[#00E5FF]" />}
                            <span className="truncate">{skill.name}</span>
                          </span>
                        );
                      })}
                    </div>
                  </article>
                );
              })}
            </div>
          </motion.section>

          {/* Education Journey Section */}
          <motion.section variants={itemVariants} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <div
                  className="font-mono inline-flex items-center gap-2 border border-[#00E5FF]/30 bg-[#00E5FF]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#00E5FF] mb-2"
                  style={{ borderRadius: '0px' }}
                >
                  <span className="h-1.5 w-1.5 bg-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.8)] animate-pulse" />
                  $ git log --journey
                </div>
                <h2 className="font-sans text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                  Learning <span className="text-[#00E5FF]">Journey</span>
                </h2>
                <p className="font-sans mt-2 max-w-2xl text-sm leading-relaxed text-gray-300">
                  Key milestones across BCA coursework, IIT Mandi AI Minor, full-stack projects, and continuous learning.
                </p>
              </div>
              <Link
                to="/experience"
                className="font-mono inline-flex items-center gap-2 border border-[#00E5FF]/60 px-4 py-2 text-xs font-semibold text-[#00E5FF] transition-all duration-300 hover:bg-[#00E5FF] hover:text-black"
                style={{ borderRadius: '0px' }}
              >
                View full journey <FaArrowRight size={12} />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {experiencePreview.map((item) => {
                const ExperienceIcon = item.icon;

                return (
                  <Link
                    key={item.title}
                    to={`/experience?journey=${item.id}`}
                    aria-label={`Open ${item.title} journey`}
                    className="group block h-full focus-visible:outline-none"
                  >
                    <article
                      className="relative h-full border border-[#00E5FF]/20 bg-black/80 p-5 text-left transition-all duration-300 hover:border-[#00E5FF]/60 flex flex-col justify-between"
                      style={{ borderRadius: '0px' }}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#00E5FF]/40 bg-[#00E5FF]/10 text-[#00E5FF]">
                            <ExperienceIcon className="text-base" />
                          </div>
                          <span className="font-mono border border-white/10 px-2 py-0.5 text-[10px] text-gray-400" style={{ borderRadius: '0px' }}>
                            {item.period}
                          </span>
                        </div>

                        <div className="mt-4 space-y-1.5">
                          <p className="font-mono text-xs uppercase tracking-wider text-[#00E5FF]">{item.subtitle}</p>
                          <h3 className="font-sans text-lg font-bold text-white group-hover:text-[#00E5FF] transition-colors">{item.title}</h3>
                          <p className="font-sans text-xs sm:text-sm text-gray-300 leading-relaxed pt-1" style={blogDescriptionClamp}>
                            {item.summary}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#00E5FF]/10 mt-4">
                        <span className="font-mono inline-flex items-center gap-1.5 text-xs text-[#00E5FF] group-hover:underline">
                          View details <FaArrowRight className="text-[10px]" />
                        </span>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </motion.section>

          {/* Featured Projects Section */}
          <motion.section variants={itemVariants} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <div
                  className="font-mono inline-flex items-center gap-2 border border-[#00E5FF]/30 bg-[#00E5FF]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#00E5FF] mb-2"
                  style={{ borderRadius: '0px' }}
                >
                  <span className="h-1.5 w-1.5 bg-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.8)] animate-pulse" />
                  $ ls ./projects
                </div>
                <h2 className="font-sans text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                  Featured <span className="text-[#00E5FF]">Projects</span>
                </h2>
                <p className="font-sans mt-2 max-w-2xl text-sm leading-relaxed text-gray-300">
                  Full stack web applications, AI integrations, and developer tools built with React, Node.js, and Python.
                </p>
              </div>
              <Link
                to="/projects"
                className="font-mono inline-flex items-center gap-2 border border-[#00E5FF]/60 px-4 py-2 text-xs font-semibold text-[#00E5FF] transition-all duration-300 hover:bg-[#00E5FF] hover:text-black"
                style={{ borderRadius: '0px' }}
              >
                All projects <FaArrowRight size={12} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              {projectPreview.map((project) => (
                <div
                  key={project.title}
                  className="group flex h-full min-h-[360px] flex-col overflow-hidden border border-[#00E5FF]/20 bg-black/80 hover:border-[#00E5FF]/60 transition-all duration-300"
                  style={{ borderRadius: '0px' }}
                >
                  {project.image && (
                    <div className="relative overflow-hidden h-36 border-b border-[#00E5FF]/20">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 transition-all duration-300"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-sans text-lg font-bold text-white mb-2 leading-tight group-hover:text-[#00E5FF] transition-colors">{project.title}</h3>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.technologies.map((tech) => (
                        <span
                          key={`${project.title}-${tech}`}
                          className="font-mono px-2 py-0.5 text-[10px] border border-[#00E5FF]/30 bg-[#00E5FF]/5 text-[#00E5FF]"
                          style={{ borderRadius: '0px' }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    {project.description && (
                      <p
                        className="font-sans text-xs leading-relaxed text-gray-300 mb-4"
                        style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3, overflow: 'hidden' }}
                      >
                        {project.description}
                      </p>
                    )}
                    <div className="mt-auto grid grid-cols-2 gap-2 pt-2 border-t border-[#00E5FF]/10">
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono py-2 text-center text-xs font-semibold border border-white/20 text-gray-300 hover:border-[#00E5FF] hover:text-[#00E5FF] transition-colors"
                        style={{ borderRadius: '0px' }}
                      >
                        Code
                      </a>
                      <a
                        href={project.liveDemoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono py-2 text-center text-xs font-semibold border border-[#00E5FF]/60 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black transition-colors"
                        style={{ borderRadius: '0px' }}
                      >
                        Demo
                      </a>
                    </div>
                  </div>
                </div>
              ))}

              <div
                className="border border-[#00E5FF]/30 bg-[#00E5FF]/[0.03] p-6 flex items-center justify-center text-center flex-col min-h-[360px]"
                style={{ borderRadius: '0px' }}
              >
                <div className="font-mono text-xs text-[#00E5FF] uppercase tracking-widest mb-2">$ git status</div>
                <h3 className="font-sans text-2xl font-bold text-white mb-2">View All Projects</h3>
                <p className="font-sans text-xs text-gray-400 mb-5 max-w-xs">Explore more repositories and live full-stack builds.</p>
                <Link
                  to="/projects"
                  className="font-mono inline-flex items-center gap-2 border border-[#00E5FF] px-5 py-2.5 text-xs font-semibold text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black transition-all"
                  style={{ borderRadius: '0px' }}
                >
                  Explore <FaArrowRight size={12} />
                </Link>
              </div>
            </div>
          </motion.section>

          {/* Latest Blogs Section */}
          <motion.section variants={itemVariants} className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div
                  className="font-mono inline-flex items-center gap-2 border border-[#00E5FF]/30 bg-[#00E5FF]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#00E5FF] mb-2"
                  style={{ borderRadius: '0px' }}
                >
                  <span className="h-1.5 w-1.5 bg-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.8)] animate-pulse" />
                  $ cat latest_articles.md
                </div>
                <h2 className="font-sans text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                  Latest <span className="text-[#00E5FF]">Articles</span>
                </h2>
                <p className="font-sans mt-2 max-w-2xl text-sm leading-relaxed text-gray-300">
                  Insights and walkthroughs on AI, full stack development, and practical developer routines.
                </p>
              </div>
              <Link
                to="/blog"
                className="font-mono inline-flex items-center gap-2 border border-[#00E5FF]/60 px-4 py-2 text-xs font-semibold text-[#00E5FF] transition-all duration-300 hover:bg-[#00E5FF] hover:text-black"
                style={{ borderRadius: '0px' }}
              >
                All articles <FaArrowRight size={12} />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {blogPreview.map((blog) => (
                <article
                  key={blog.slug}
                  className="group relative border border-[#00E5FF]/20 bg-black/80 p-5 transition-all duration-300 hover:border-[#00E5FF]/60 flex flex-col justify-between"
                  style={{ borderRadius: '0px' }}
                >
                  <div>
                    <span
                      className="font-mono inline-flex border border-[#00E5FF]/30 bg-[#00E5FF]/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#00E5FF]"
                      style={{ borderRadius: '0px' }}
                    >
                      {blog.category}
                    </span>

                    <div className="mt-4 space-y-2">
                      <h3 className="font-sans text-lg font-bold text-white group-hover:text-[#00E5FF] transition-colors leading-snug">{blog.title}</h3>
                      <p className="font-sans text-xs sm:text-sm leading-relaxed text-gray-300" style={blogDescriptionClamp}>
                        {blog.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3 pt-3 border-t border-[#00E5FF]/10">
                    <span className="font-mono text-[11px] text-gray-500">article preview</span>
                    <Link
                      to={`/blog/${blog.slug}`}
                      className="font-mono inline-flex items-center gap-1.5 text-xs text-[#00E5FF] group-hover:underline"
                    >
                      Read More
                      <FaArrowRight size={10} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
}
