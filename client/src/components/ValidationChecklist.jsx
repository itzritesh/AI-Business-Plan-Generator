import React, { useState } from 'react';
import { FiCheckSquare, FiSquare } from 'react-icons/fi';

const ValidationChecklist = ({ tasks = [] }) => {
  const [completedTasks, setCompletedTasks] = useState({});

  const toggleTask = (index) => {
    setCompletedTasks(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (!tasks || tasks.length === 0) return null;

  return (
    <div className="space-y-3">
      {tasks.map((taskItem, idx) => {
        const isCompleted = !!completedTasks[idx];
        const taskName = taskItem.task || taskItem;
        const taskDesc = taskItem.description || '';

        return (
          <div
            key={idx}
            onClick={() => toggleTask(idx)}
            className={`flex items-start p-4 rounded-xl border transition-all duration-150 cursor-pointer select-none
              ${isCompleted 
                ? 'bg-slate-50/50 dark:bg-slate-900/30 border-emerald-500/20 text-slate-400 dark:text-slate-500' 
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-100 hover:border-brand/40 dark:hover:border-brand-light/30 shadow-sm'
              }
            `}
          >
            <button
              type="button"
              className="mr-3 mt-0.5 text-slate-400 dark:text-slate-650 hover:text-brand focus:outline-none transition-colors"
            >
              {isCompleted ? (
                <FiCheckSquare className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
              ) : (
                <FiSquare className="w-5 h-5" />
              )}
            </button>
            <div className="flex-1">
              <span className={`font-semibold text-sm ${isCompleted ? 'line-through' : ''}`}>
                {taskName}
              </span>
              {taskDesc && (
                <p className={`text-xs mt-1 leading-relaxed ${isCompleted ? 'text-slate-400/80 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'}`}>
                  {taskDesc}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ValidationChecklist;
