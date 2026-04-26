import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ title, value, icon: Icon, color }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`bg-gradient-to-br ${color} p-5 sm:p-6 rounded-lg text-white shadow-lg hover:shadow-2xl transition-all`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm sm:text-base font-medium opacity-90">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="p-2.5 sm:p-3 bg-white/20 rounded-lg shrink-0">
          <Icon size={24} className="sm:w-7 sm:h-7" />
        </div>
      </div>
    </motion.div>
  );
}
