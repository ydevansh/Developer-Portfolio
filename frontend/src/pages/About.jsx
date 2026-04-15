import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold">About Me</h1>

          <div className="space-y-6 text-gray-400 leading-relaxed">
            <p className="text-lg">
              I am an aspiring AI engineer with a strong foundation in Python and full stack development, currently pursuing a minor in Artificial Intelligence from IIT Mandi. I enjoy building intelligent, real-world applications and continuously improving my skills through hands-on projects.
            </p>

            <p className="text-lg">
              My goal is to create scalable and impactful solutions using modern technologies. I have experience with full stack technologies like React, Node.js, and MongoDB, coupled with AI/ML knowledge from my studies.
            </p>

            <div className="space-y-4 pt-8">
              <h2 className="text-2xl font-bold text-white">Education</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-white">BCA - Babu Banarasi Das University</h3>
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
