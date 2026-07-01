import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import Footer from '../components/Footer.jsx';

const DashboardLayout = () => {
  const { token, loading } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // While checking user profile sessions, show a loading spinner
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="w-10 h-10 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Validating active sessions...</p>
      </div>
    );
  }

  // Route security: redirect to login if no auth token is saved
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar onMobileMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

      {/* Main Core Layout: Sidebar + Route View */}
      <div className="flex flex-1 relative overflow-hidden">
        <Sidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

        {/* Dynamic Route Display */}
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
          
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
