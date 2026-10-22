/**
 * BackgroundContext.jsx
 *
 * Provides a global React context for background selection.
 * Defaults strictly to 'matrix' (Digital Rain).
 * Supported keys:
 *   - 'matrix'  : Digital Rain binary matrix background (DEFAULT)
 *   - 'solar'   : 3D Solar System Orrery & starry background
 *   - 'network' : Connected-dots / particle network background
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

/** @type {'matrix' | 'solar' | 'network'} */
const DEFAULT_BG = 'matrix';
const STORAGE_KEY = 'portfolio_bg_choice_v2';

const BackgroundContext = createContext(null);

export function BackgroundProvider({ children }) {
  const [activeBackground, setActiveBackgroundState] = useState(() => {
    try {
      // Clear old legacy preference key so initial render strictly defaults to matrix
      if (localStorage.getItem('portfolio_bg_preference')) {
        localStorage.removeItem('portfolio_bg_preference');
      }
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'matrix' || stored === 'solar' || stored === 'network') {
        return stored;
      }
    } catch {
      // localStorage blocked (private mode, etc.)
    }
    return DEFAULT_BG;
  });

  const setActiveBackground = useCallback((key) => {
    setActiveBackgroundState(key);
    try {
      localStorage.setItem(STORAGE_KEY, key);
    } catch {
      // ignore
    }
  }, []);

  return (
    <BackgroundContext.Provider value={{ activeBackground, setActiveBackground }}>
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  const ctx = useContext(BackgroundContext);
  if (!ctx) throw new Error('useBackground must be used inside BackgroundProvider');
  return ctx;
}
