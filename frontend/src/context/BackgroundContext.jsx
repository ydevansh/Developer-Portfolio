/**
 * BackgroundContext.jsx
 *
 * Provides a global React context for background selection.
 * Persists the user's choice in localStorage so the preference
 * survives page refreshes — but the DEFAULT on very first visit
 * is always 'professional'.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

/** @type {'professional' | 'solar'} */
const DEFAULT_BG = 'professional';
const STORAGE_KEY = 'portfolio_bg_preference';

const BackgroundContext = createContext(null);

export function BackgroundProvider({ children }) {
  const [activeBackground, setActiveBackgroundState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      // Only honour stored value if it's a known valid key
      if (stored === 'professional' || stored === 'solar') return stored;
    } catch {
      // localStorage blocked (private mode, etc.) — fall through
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

