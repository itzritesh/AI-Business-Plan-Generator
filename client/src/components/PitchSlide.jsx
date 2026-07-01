import React, { useState } from 'react';
import { FiMessageSquare, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const PitchSlide = ({ slide }) => {
  const [showNotes, setShowNotes] = useState(false);

  if (!slide) return null;

  const { title, subtitle, content, speakerNotes } = slide;

  // Split slide content by newlines to render as bullets or separate paragraphs
  const bullets = typeof content === 'string' 
    ? content.split('\n').filter(line => line.trim() !== '')
    : Array.isArray(content) ? content : [];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* 16:9 Presentation Canvas */}
      <div className="relative w-full aspect-[16/9] rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white p-8 md:p-12 flex flex-col justify-between shadow-2xl border border-indigo-500/20 overflow-hidden">
        {/* Decorative Grid Mesh */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Slide Header */}
        <div className="z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-100 bg-clip-text text-transparent">
              {title}
            </h2>
            <span className="text-xs md:text-sm font-semibold px-2.5 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/25 text-indigo-300">
              Slide {slide.slideNumber} / 10
            </span>
          </div>
          {subtitle && (
            <p className="text-xs md:text-base font-medium text-indigo-300/80 mt-1 md:mt-2">
              {subtitle}
            </p>
          )}
          <hr className="border-indigo-500/10 mt-3 md:mt-4" />
        </div>

        {/* Slide Body */}
        <div className="z-10 flex-1 flex flex-col justify-center my-4">
          <ul className="space-y-2 md:space-y-3">
            {bullets.map((bullet, idx) => (
              <li key={idx} className="flex items-start text-xs md:text-lg text-slate-200">
                <span className="text-indigo-400 mr-3 mt-1.5">&#9670;</span>
                <span>{bullet.replace(/^[-\d\s.*]+/, '')}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Slide Footer Branding */}
        <div className="z-10 flex justify-between items-center text-[10px] md:text-xs text-slate-500">
          <span>LaunchForge AI Pitch Engine</span>
          <span>Confidential Startup Proposal</span>
        </div>
      </div>

      {/* Speaker Notes Overlay */}
      {speakerNotes && (
        <div className="glass-card rounded-2xl p-4 shadow-sm border border-slate-250">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="flex items-center justify-between w-full text-xs font-semibold text-slate-650 dark:text-slate-350 focus:outline-none"
          >
            <span className="flex items-center">
              <FiMessageSquare className="w-4 h-4 mr-2 text-brand" />
              Presenter Speaker Notes
            </span>
            {showNotes ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
          </button>

          {showNotes && (
            <div className="mt-3 pl-6 border-l-2 border-brand text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
              {speakerNotes}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PitchSlide;
