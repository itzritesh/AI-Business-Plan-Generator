import React from 'react';
import { useTheme } from '../hooks/useTheme.js';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-brand dark:hover:text-brand-light focus:outline-none transition-all duration-200 shadow-sm"
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? (
        <FiSun className="w-5 h-5 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <FiMoon className="w-5 h-5 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
};

export default ThemeToggle;
