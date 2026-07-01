import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiGrid,
  FiFileText,
  FiCompass,
  FiDollarSign,
  FiAirplay,
  FiMessageSquare,
  FiCheckSquare,
  FiUser,
  FiX
} from 'react-icons/fi';

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: FiGrid },
    { name: 'Business Plan', path: '/business-plan', icon: FiFileText },
    { name: 'Market Research', path: '/market-research', icon: FiCompass },
    { name: 'Financial Model', path: '/financial-model', icon: FiDollarSign },
    { name: 'Pitch Deck', path: '/pitch-deck', icon: FiAirplay },
    { name: 'Startup Coach', path: '/startup-coach', icon: FiMessageSquare },
    { name: 'Validation Tool', path: '/validation', icon: FiCheckSquare },
    { name: 'Profile Settings', path: '/profile', icon: FiUser },
  ];

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-40 flex flex-col w-64 border-r border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 
    transition-transform duration-300 transform lg:translate-x-0 lg:static lg:h-[calc(100vh-4rem)]
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-35 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      <aside className={sidebarClasses}>
        {/* Mobile Header X-Close */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-slate-100 dark:border-slate-800/60 lg:hidden">
          <span className="font-bold text-slate-700 dark:text-slate-200">Navigation Menu</span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-150 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 focus:outline-none"
            aria-label="Close menu drawer"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-150 group
                  ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-brand dark:text-brand-light'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-slate-100'
                  }
                `}
              >
                <Icon className="w-5 h-5 mr-3 transition-transform duration-150 group-hover:scale-105" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Banner */}
        <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 dark:border-indigo-500/10 hidden lg:block">
          <h4 className="text-xs font-bold text-indigo-700 dark:text-indigo-400">Startup Academy 🧠</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Need advice? Direct-message our AI Coach inside the chat panel for legal, hiring, or scaling tips.
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
