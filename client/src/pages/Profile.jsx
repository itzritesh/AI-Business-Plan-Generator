import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { getHistory } from '../services/businessApi.js';
import { FiUser, FiMail, FiShield, FiFolder, FiActivity, FiKey } from 'react-icons/fi';

const Profile = () => {
  const { user, logout } = useAuth();
  const [plansCount, setPlansCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistoryCount = async () => {
      try {
        const data = await getHistory();
        setPlansCount(data.length);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistoryCount();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slide-up font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Account Profile</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review your subscription parameters, workspace analytics, and login credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card (Left) */}
        <div className="md:col-span-1 glass-card rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex flex-col items-center justify-between text-center space-y-4">
          <div className="space-y-3">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 dark:text-white text-lg">{user?.name}</h3>
              <p className="text-xs text-indigo-650 dark:text-indigo-400 font-semibold mt-0.5">SaaS Sandbox Founder</p>
            </div>
          </div>
          
          <button
            onClick={logout}
            type="button"
            className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 dark:hover:bg-red-950/40 dark:text-red-400 font-semibold text-xs rounded-xl transition"
          >
            Sign Out of Account
          </button>
        </div>

        {/* Workspace details & login information (Right) */}
        <div className="md:col-span-2 space-y-6">
          {/* Details Box */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-5">
            <h3 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/60 pb-2">
              Security & Credentials
            </h3>
            
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-center space-x-3.5">
                <FiMail className="w-5 h-5 text-slate-400" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Email Address</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3.5">
                <FiShield className="w-5 h-5 text-slate-400" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Account Status</span>
                  <p className="font-semibold text-emerald-600 dark:text-emerald-400">Authenticated (JWT Active)</p>
                </div>
              </div>

              <div className="flex items-center space-x-3.5">
                <FiKey className="w-5 h-5 text-slate-400" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Security Token</span>
                  <p className="font-semibold text-slate-500 dark:text-slate-450 truncate max-w-xs">
                    Bearer token verified via server.js
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Box */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-5">
            <h3 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/60 pb-2">
              Workspace Statistics
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-850 flex items-center space-x-3">
                <FiFolder className="w-5 h-5 text-indigo-500" />
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Generated Plans</span>
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-white">
                    {loading ? '...' : plansCount}
                  </h4>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-850 flex items-center space-x-3">
                <FiActivity className="w-5 h-5 text-emerald-500" />
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Coach Chat Sessions</span>
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-white">Active</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
