import React from 'react';

const Loading = ({ message = 'AI is compiling data...', fullPage = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
      {/* Outer Pulse Rings */}
      <div className="relative flex items-center justify-center w-16 h-16">
        <div className="absolute w-full h-full rounded-full border-4 border-brand/20 dark:border-brand-light/10 animate-ping"></div>
        <div className="absolute w-12 h-12 rounded-full border-4 border-brand/40 dark:border-brand-light/30 animate-pulse"></div>
        <div className="w-8 h-8 rounded-full border-4 border-t-brand dark:border-t-brand-light border-slate-200 dark:border-slate-800 animate-spin"></div>
      </div>
      <div>
        <p className="text-lg font-medium text-slate-800 dark:text-slate-200 animate-pulse-slow">
          {message}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          This may take a moment to generate structured JSON formats.
        </p>
      </div>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/80 dark:bg-slate-950/85 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return <div className="glass-card rounded-2xl p-6 shadow-md">{content}</div>;
};

export default Loading;
