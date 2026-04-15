import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaGithub, FaLinkedin } from 'react-icons/fa';
import profileImage from '../assets/profile.jpg';

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
      title: 'Frontend',
      items: ['React', 'Tailwind CSS', 'JavaScript', 'Responsive UI'],
    },
    {
      title: 'Backend',
      items: ['Node.js', 'Express.js', 'MongoDB', 'REST APIs'],
    },
    {
      title: 'AI and Core',
      items: ['Python', 'Machine Learning', 'Problem Solving', 'Data Structures'],
    },
  ];

  const experiencePreview = [
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

  const projectPreview = [
    {
      title: 'Portfolio Platform',
      description: 'A personal portfolio with admin management and dynamic sections.',
    },
    {
      title: 'MERN Applications',
      description: 'Scalable full stack apps with authentication and clean UI workflows.',
    },
    {
      title: 'AI-driven Ideas',
      description: 'Exploring intelligent solutions that combine automation with UX.',
    },
  ];

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
                  <p>BCA - Babu Banarasi Das University</p>
                  <p>AI Minor - IIT Mandi (Online)</p>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section variants={itemVariants} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary-400 mb-2">Skills</p>
                <h2 className="text-3xl md:text-4xl font-bold">Technical Skills</h2>
              </div>
              <Link
                to="/skills"
                className="w-fit px-5 py-2.5 bg-primary-500/20 border border-primary-500 hover:bg-primary-500/30 rounded-lg transition-colors duration-300"
              >
                View All Skills
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skillGroups.map((group) => (
                <div key={group.title} className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4 text-primary-400">{group.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-full text-sm bg-primary-500/20 text-gray-200 border border-primary-500/25"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {experiencePreview.map((item) => (
                <div
                  key={item.title}
                  className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-6 hover:border-primary-500/40 transition-colors duration-300"
                >
                  <p className="text-sm text-primary-400 mb-2">{item.subtitle}</p>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.description}</p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projectPreview.map((project) => (
                <div
                  key={project.title}
                  className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-6 hover:translate-y-[-4px] transition-all duration-300"
                >
                  <h3 className="text-xl font-semibold mb-3">{project.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{project.description}</p>
                </div>
              ))}
            </div>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
}
