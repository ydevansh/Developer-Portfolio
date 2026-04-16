import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaGithub, FaLinkedin } from 'react-icons/fa';
import { HiOutlineCodeBracket, HiOutlineCpuChip, HiOutlineSquares2X2 } from 'react-icons/hi2';
import {
  SiC,
  SiGit,
  SiJavascript,
  SiMysql,
  SiNodedotjs,
  SiNumpy,
  SiPandas,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiTensorflow,
} from 'react-icons/si';
import profileImage from '../assets/profile.jpg';
import { generatedProjects } from '../data/portfolioContent';

export default function Home() {
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

  const skillGroups = [
    {
      title: 'AI & Data Science',
      icon: HiOutlineCpuChip,
      titleClass: 'from-blue-300 to-cyan-300',
      badgeClass:
        'bg-blue-500/20 text-blue-100 border border-blue-400/35 hover:bg-blue-500/30 hover:border-blue-300/45',
      glowClass: 'from-blue-500/20 via-transparent to-cyan-500/20',
      items: [
        { label: 'Python', icon: SiPython },
        { label: 'Machine Learning', icon: SiTensorflow },
        { label: 'Data Analysis', icon: HiOutlineCpuChip },
        { label: 'Pandas', icon: SiPandas },
        { label: 'NumPy', icon: SiNumpy },
      ],
    },
    {
      title: 'Web Development',
      icon: HiOutlineSquares2X2,
      titleClass: 'from-fuchsia-300 to-violet-300',
      badgeClass:
        'bg-violet-500/20 text-violet-100 border border-violet-400/35 hover:bg-violet-500/30 hover:border-violet-300/45',
      glowClass: 'from-fuchsia-500/20 via-transparent to-violet-500/20',
      items: [
        { label: 'React', icon: SiReact },
        { label: 'JavaScript', icon: SiJavascript },
        { label: 'Tailwind CSS', icon: SiTailwindcss },
        { label: 'Node.js', icon: SiNodedotjs },
        { label: 'Git', icon: SiGit },
      ],
    },
    {
      title: 'Languages',
      icon: HiOutlineCodeBracket,
      titleClass: 'from-cyan-300 to-sky-300',
      badgeClass:
        'bg-cyan-500/20 text-cyan-100 border border-cyan-400/35 hover:bg-cyan-500/30 hover:border-cyan-300/45',
      glowClass: 'from-cyan-500/20 via-transparent to-sky-500/20',
      items: [
        { label: 'Python', icon: SiPython },
        { label: 'JavaScript', icon: SiJavascript },
        { label: 'C', icon: SiC },
        { label: 'SQL', icon: SiMysql },
      ],
    },
  ];

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

  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Text Content */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div>
              <motion.h1
                className="text-5xl md:text-6xl font-bold leading-tight"
                variants={itemVariants}
              >
                Hi, I'm{' '}
                <span className="bg-gradient-to-r from-primary-500 to-secondary bg-clip-text text-transparent">
                  Devansh Yadav
                </span>
              </motion.h1>
            </div>

            <motion.div variants={itemVariants} className="space-y-2">
              <p className="text-2xl font-semibold text-gray-300">Full Stack Developer</p>
              <p className="text-xl text-gray-400">UI Designer - AI Engineer</p>
            </motion.div>

            <motion.p variants={itemVariants} className="text-gray-400 leading-relaxed text-lg">
              I'm an aspiring AI engineer with a passion for building intelligent, scalable solutions using modern
              technologies. Currently based in Lucknow, India.
            </motion.p>

            <motion.div variants={itemVariants} className="flex gap-4 pt-4">
              <Link
                to="/contact"
                className="px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-lg font-medium flex items-center gap-2 transition-colors duration-300"
              >
                Get in Touch <FaArrowRight size={16} />
              </Link>
              <Link
                to="/projects"
                className="px-6 py-3 border border-primary-500 hover:border-primary-400 bg-transparent hover:bg-primary-500/10 rounded-lg font-medium transition-colors duration-300"
              >
                View Projects
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="flex gap-4 pt-4">
              <a
                href="https://github.com/ydevansh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-500 transition-colors"
              >
                <FaGithub size={24} />
              </a>
              <a
                href="https://www.linkedin.com/in/ydevansh/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-500 transition-colors"
              >
                <FaLinkedin size={24} />
              </a>
            </motion.div>
          </motion.div>

          {/* Hero Illustration */}
          <motion.div variants={itemVariants} className="w-full flex justify-center md:justify-end">
            <motion.div
              className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="absolute inset-0 rounded-full bg-primary-500/20 blur-3xl scale-110" />
              <div className="relative w-full h-full rounded-full p-2 bg-gradient-to-br from-primary-500 via-secondary to-primary-500 shadow-[0_20px_60px_rgba(6,182,212,0.35)]">
                <div className="w-full h-full rounded-full overflow-hidden border border-white/20 bg-slate-900">
                  <img
                    src={profileImage}
                    alt="Devansh Yadav portrait"
                    className="w-full h-full object-cover object-[50%_32%] scale-x-105 transition-transform duration-500 hover:scale-x-110"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

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
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a1430]/55 px-4 py-12 sm:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_35%,rgba(34,211,238,0.2),transparent_38%),radial-gradient(circle_at_80%_20%,rgba(192,132,252,0.18),transparent_38%),radial-gradient(circle_at_50%_100%,rgba(2,132,199,0.2),transparent_45%)]" />
              <div className="relative">
                <div className="text-center">
                  <p className="inline-flex rounded-full border border-violet-400/25 bg-violet-500/20 px-5 py-2 text-xs font-semibold tracking-[0.2em] text-violet-200">
                    WHAT I KNOW
                  </p>
                  <h2 className="mt-5 text-5xl md:text-6xl font-bold bg-gradient-to-r from-fuchsia-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
                    My Skills
                  </h2>
                  <p className="mt-4 text-gray-300 text-lg">
                    Technologies and tools I use to bring ideas to life
                  </p>
                </div>

                <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-7">
                  {skillGroups.map((group) => {
                    const SectionIcon = group.icon;
                    return (
                      <motion.article
                        key={group.title}
                        whileHover={{ y: -8, scale: 1.01 }}
                        transition={{ duration: 0.28, ease: 'easeOut' }}
                        className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/45 p-7 backdrop-blur-xl"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${group.glowClass}`} />
                        <div className="relative">
                          <div className="flex items-center gap-3">
                            <SectionIcon className="text-4xl text-cyan-300" />
                            <h3 className={`text-4xl lg:text-3xl font-bold bg-gradient-to-r ${group.titleClass} bg-clip-text text-transparent`}>
                              {group.title}
                            </h3>
                          </div>

                          <div className="mt-7 flex flex-wrap gap-3">
                            {group.items.map((skill) => {
                              const SkillIcon = skill.icon;
                              return (
                                <span
                                  key={skill.label}
                                  className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all duration-300 ${group.badgeClass}`}
                                >
                                  {SkillIcon && <SkillIcon className="text-base" />}
                                  {skill.label}
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
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 px-8 py-4 text-lg font-semibold text-white shadow-[0_12px_40px_rgba(56,189,248,0.35)] transition-transform duration-300 hover:scale-[1.02]"
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
        </motion.div>
      </div>
    </div>
  );
}
