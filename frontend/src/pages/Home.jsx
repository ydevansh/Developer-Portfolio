import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaGithub, FaLinkedin } from 'react-icons/fa';

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
                Hi, I'm <span className="bg-gradient-to-r from-primary-500 to-secondary bg-clip-text text-transparent">Devansh Yadav</span>
              </motion.h1>
            </div>

            <motion.div variants={itemVariants} className="space-y-2">
              <p className="text-2xl font-semibold text-gray-300">Full Stack Developer</p>
              <p className="text-xl text-gray-400">UI Designer • AI Engineer</p>
            </motion.div>

            <motion.p variants={itemVariants} className="text-gray-400 leading-relaxed text-lg">
              I'm an aspiring AI engineer with a passion for building intelligent, scalable solutions using modern technologies. Currently based in Lucknow, India.
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
          <motion.div
            variants={itemVariants}
            className="hidden md:block"
          >
            <div className="w-full h-96 bg-gradient-to-br from-primary-500/20 to-secondary/20 rounded-2xl border border-primary-500/30 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-400">Profile Image/Illustration</p>
                <p className="text-sm text-gray-500">Coming Soon...</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Featured Section Preview */}
        <motion.div
          className="mt-24 pt-16 border-t border-primary-500/20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-8">
            Featured Work
          </motion.h2>
          <motion.p variants={itemVariants} className="text-gray-400 mb-8">
            Check out my latest projects and contributions
          </motion.p>
          <Link
            to="/projects"
            className="inline-block px-6 py-3 bg-primary-500/20 border border-primary-500 hover:bg-primary-500/30 rounded-lg transition-colors duration-300"
          >
            Explore All Projects →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
