import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

const aboutSeo = {
  title: 'About Devansh Yadav | AI/ML Developer from Lucknow',
  description:
    'Learn about Devansh Yadav, an AI/ML Developer and Web Developer from Lucknow who studies at Babu Banarasi Das University (BBDU) and builds practical projects.',
  keywords: ['Devansh Yadav', 'Devansh Lucknow', 'Devansh BBD', 'AI/ML Developer', 'Web Developer', 'BBDU'],
};

export default function About() {
  return (
    <div className="pt-32 pb-20">
      <Seo
        title={aboutSeo.title}
        description={aboutSeo.description}
        keywords={aboutSeo.keywords}
        canonicalPath="/about"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold">About Devansh Yadav</h1>

          <div className="space-y-6 text-gray-400 leading-relaxed">
            <p className="text-lg">
              I am Devansh Yadav, an aspiring AI engineer and web developer from Lucknow with a strong foundation in Python and full stack development. I am currently pursuing a BCA at Babu Banarasi Das University (BBDU) and enjoy building intelligent, real-world applications through hands-on projects.
            </p>

            <p className="text-lg">
              My goal is to create scalable and impactful solutions using modern technologies. I have experience with React, Node.js, Python, MongoDB, and SQL, combined with AI/ML knowledge from my studies.
            </p>

            <div className="space-y-4 pt-8">
              <h2 className="text-2xl font-bold text-white">Education</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-white">BCA - Babu Banarasi Das University (BBDU), Lucknow</h3>
                  <p className="text-sm text-gray-500">Bachelor of Computer Applications</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white">AI Minor - IIT Mandi (Online)</h3>
                  <p className="text-sm text-gray-500">Minor in Artificial Intelligence</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <Link
              to="/skills"
              className="inline-block px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-lg font-medium transition-colors duration-300"
            >
              View My Skills →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
