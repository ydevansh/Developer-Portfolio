/**
 * BackgroundContext.jsx
 *
 * Provides a global React context for background selection.
 * Supported keys:
 *   - 'network' : Connected-dots / particle network background
 *   - 'solar'   : 3D Solar System Orrery & starry background
 *   - 'matrix'  : Matrix digital rain binary falling code background (DEFAULT)
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

/** @type {'matrix' | 'solar' | 'network'} */
const DEFAULT_BG = 'matrix';
const STORAGE_KEY = 'portfolio_bg_preference';

const BackgroundContext = createContext(null);

export function BackgroundProvider({ children }) {
  const [activeBackground, setActiveBackgroundState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'matrix' || stored === 'solar' || stored === 'network') {
        return stored;
      }
      if (stored === 'professional') {
        return 'network';
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
