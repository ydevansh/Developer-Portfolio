import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ className = '', size = 'md' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const isSmall = size === 'sm';

  return (
    <button
      id="theme-toggle-btn"
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`group relative flex items-center justify-center rounded-xl border transition-all duration-300 ${
        isDark
          ? 'border-white/15 bg-white/5 text-amber-300 hover:border-amber-400/40 hover:bg-amber-500/10 shadow-[0_4px_16px_rgba(0,0,0,0.3)]'
          : 'border-slate-300/80 bg-slate-100 text-indigo-600 hover:border-indigo-500/40 hover:bg-indigo-50 shadow-[0_4px_16px_rgba(99,102,241,0.15)]'
      } ${isSmall ? 'h-8 w-8 p-1.5' : 'h-9 w-9 p-2'} ${className}`}
    >
      <div className="relative flex items-center justify-center">
        {isDark ? (
          <FaSun
            size={isSmall ? 15 : 16}
            className="transition-transform duration-300 group-hover:rotate-45"
          />
        ) : (
          <FaMoon
            size={isSmall ? 14 : 15}
            className="transition-transform duration-300 group-hover:-rotate-12"
          />
        )}
      </div>

      {/* Subtle indicator dot */}
      <span
        className={`absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full transition-all ${
          isDark
            ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
            : 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]'
        }`}
      />
    </button>
  );
}
