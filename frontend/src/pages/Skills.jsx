import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import skillService from '../services/skillService';

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
          groupedSkills[skill.category].push(skill);
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

  if (loading) {
    return <div className="pt-32 pb-20 text-center">Loading skills...</div>;
  }

  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="space-y-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold">My Skills</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(skills).map(([category, categorySkills]) => (
              <motion.div
                key={category}
                className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-6"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-bold mb-4 text-primary-500">{category}</h3>
                <div className="space-y-3">
                  {categorySkills.map((skill) => (
                    <div key={skill._id} className="flex items-center justify-between">
                      <span className="text-gray-300">{skill.name}</span>
                      <span className="text-xs text-primary-400">{skill.proficiency}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {Object.keys(skills).length === 0 && (
            <div className="text-center text-gray-400 py-12">
              No skills added yet. Check back soon!
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
