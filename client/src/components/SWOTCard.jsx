import React from 'react';
import { FiPlusCircle, FiMinusCircle, FiCompass, FiAlertTriangle } from 'react-icons/fi';

const SWOTCard = ({ swot }) => {
  if (!swot) return null;

  const { strengths = [], weaknesses = [], opportunities = [], threats = [] } = swot;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Strengths */}
      <div className="glass-card rounded-2xl p-6 border-l-4 border-emerald-500 shadow-sm">
        <div className="flex items-center space-x-2.5 mb-4">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-950/40 rounded-xl text-emerald-600 dark:text-emerald-400">
            <FiPlusCircle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100">Strengths (S)</h3>
        </div>
        <ul className="space-y-2">
          {strengths.map((item, idx) => (
            <li key={idx} className="flex items-start text-sm text-slate-655 dark:text-slate-350">
              <span className="text-emerald-500 mr-2 mt-1">&#8226;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Weaknesses */}
      <div className="glass-card rounded-2xl p-6 border-l-4 border-amber-500 shadow-sm">
        <div className="flex items-center space-x-2.5 mb-4">
          <div className="p-2 bg-amber-100 dark:bg-amber-950/40 rounded-xl text-amber-600 dark:text-amber-400">
            <FiMinusCircle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100">Weaknesses (W)</h3>
        </div>
        <ul className="space-y-2">
          {weaknesses.map((item, idx) => (
            <li key={idx} className="flex items-start text-sm text-slate-655 dark:text-slate-350">
              <span className="text-amber-500 mr-2 mt-1">&#8226;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Opportunities */}
      <div className="glass-card rounded-2xl p-6 border-l-4 border-blue-500 shadow-sm">
        <div className="flex items-center space-x-2.5 mb-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-950/40 rounded-xl text-blue-600 dark:text-blue-400">
            <FiCompass className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100">Opportunities (O)</h3>
        </div>
        <ul className="space-y-2">
          {opportunities.map((item, idx) => (
            <li key={idx} className="flex items-start text-sm text-slate-655 dark:text-slate-350">
              <span className="text-blue-500 mr-2 mt-1">&#8226;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Threats */}
      <div className="glass-card rounded-2xl p-6 border-l-4 border-rose-500 shadow-sm">
        <div className="flex items-center space-x-2.5 mb-4">
          <div className="p-2 bg-rose-100 dark:bg-rose-950/40 rounded-xl text-rose-600 dark:text-rose-400">
            <FiAlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100">Threats (T)</h3>
        </div>
        <ul className="space-y-2">
          {threats.map((item, idx) => (
            <li key={idx} className="flex items-start text-sm text-slate-655 dark:text-slate-350">
              <span className="text-rose-500 mr-2 mt-1">&#8226;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SWOTCard;
