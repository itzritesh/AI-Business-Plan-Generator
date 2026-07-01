import React from 'react';

const Footer = () => {
  return (
    <footer className="py-6 px-8 border-t border-slate-200/50 dark:border-slate-800/40 bg-white/30 dark:bg-slate-900/20 text-center">
      <p className="text-xs text-slate-400 dark:text-slate-500">
        &copy; {new Date().getFullYear()} LaunchForge AI. Built for high-growth SaaS startups.
      </p>
    </footer>
  );
};

export default Footer;
