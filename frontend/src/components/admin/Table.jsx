import React from 'react';
import { motion } from 'framer-motion';

export default function Table({ columns, data, actions }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-primary-500/20">
            {columns.map((col) => (
              <th key={col} className="text-left py-4 px-6 font-semibold text-gray-400 text-sm">
                {col}
              </th>
            ))}
            {actions && <th className="text-left py-4 px-6 font-semibold text-gray-400 text-sm">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <motion.tr
              key={idx}
              whileHover={{ backgroundColor: 'rgba(79, 39, 245, 0.05)' }}
              className="border-b border-primary-500/10 hover:bg-primary-500/5 transition-colors"
            >
              {Object.values(row).map((cell, cellIdx) => (
                <td key={cellIdx} className="py-4 px-6 text-sm text-gray-300">
                  {cell}
                </td>
              ))}
              {actions && (
                <td className="py-4 px-6 text-sm">
                  <div className="flex items-center space-x-2">
                    {actions.map((action, actionIdx) => (
                      <button
                        key={actionIdx}
                        onClick={() => action.handler(row)}
                        className={`px-3 py-1 rounded text-xs font-medium transition-all ${action.className}`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
