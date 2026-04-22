import React from 'react';
import { motion } from 'framer-motion';

export default function ActivityCard({ activity }) {
  const Icon = activity.icon;

  return (
    <motion.div
      whileHover={{ x: 5 }}
      className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-4 hover:bg-primary-500/15 transition-all"
    >
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-primary-500/20 rounded-lg flex-shrink-0">
          <Icon className="text-primary-500" size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white">{activity.title}</h3>
          <p className="text-sm text-gray-400 mt-1">{activity.description}</p>
        </div>
        <div className="text-xs text-gray-500 flex-shrink-0">{activity.time}</div>
      </div>
    </motion.div>
  );
}
