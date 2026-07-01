import React from 'react';
import { useAuth } from '../hooks/useAuth.js';
import ThemeToggle from './ThemeToggle.jsx';
import { FiMenu, FiLogOut, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Navbar = ({ onMobileMenuToggle }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between w-full h-16 px-4 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
      {/* Left side: Mobile Toggle & Logo branding */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onMobileMenuToggle}
          type="button"
          className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden focus:outline-none"
          aria-label="Toggle Sidebar Menu"
        >
          <FiMenu className="w-6 h-6" />
        </button>
        <Link to="/dashboard" className="flex items-center space-x-2">
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
            LaunchForge
          </span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-extrabold text-white bg-indigo-600 rounded">
            AI COACH
          </span>
        </Link>
      </div>

      {/* Right side: Preferences & Profile dropdown */}
      <div className="flex items-center space-x-4">
        <ThemeToggle />

        {user && (
          <div className="flex items-center space-x-3 pl-3 border-l border-slate-200/80 dark:border-slate-800/80">
            {/* User Details */}
            <Link to="/profile" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-sm shadow">
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <span className="hidden md:inline-block text-sm font-medium text-slate-700 dark:text-slate-200">
                {user.name}
              </span>
            </Link>

            {/* Logout Button */}
            <button
              onClick={logout}
              title="Logout"
              className="p-2 rounded-xl text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 focus:outline-none"
            >
              <FiLogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
