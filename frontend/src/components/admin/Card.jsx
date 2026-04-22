import React from 'react';
import { motion } from 'framer-motion';

export default function Card({ children, className = '' }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`bg-primary-500/10 border border-primary-500/20 rounded-lg p-6 hover:bg-primary-500/15 transition-all ${className}`}
    >
      {children}
    </motion.div>
  );
}
