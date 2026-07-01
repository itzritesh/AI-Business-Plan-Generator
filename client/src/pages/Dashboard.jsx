import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHistory, deletePlan } from '../services/businessApi.js';
import {
  FiFileText,
  FiCompass,
  FiDollarSign,
  FiAirplay,
  FiMessageSquare,
  FiCheckSquare,
  FiTrash2,
  FiPlus,
  FiEye,
  FiCalendar,
  FiTarget
} from 'react-icons/fi';

const Dashboard = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await getHistory();
      setPlans(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch plan history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleDelete = async (id, e) => {
    e.preventDefault(); // Stop Link navigations
    if (!window.confirm('Are you sure you want to delete this business plan? This action is permanent.')) {
      return;
    }

    try {
      await deletePlan(id);
      setPlans(plans.filter((p) => p._id !== id));
    } catch (err) {
      alert('Failed to delete the plan. Please try again.');
    }
  };

  // SaaS Card definitions
  const modules = [
    {
      name: 'Business Plan',
      desc: 'Generate complete 18-part AI reports including operations, hiring, and growth strategies.',
      path: '/business-plan',
      icon: FiFileText,
      color: 'from-blue-500 to-indigo-650',
    },
    {
      name: 'Market Research',
      desc: 'Compile industry trends, TAM assessments, customer personas, SWOT, and PESTLE matrices.',
      path: '/market-research',
      icon: FiCompass,
      color: 'from-purple-500 to-indigo-650',
    },
    {
      name: 'Financial Modeling',
      desc: 'Build cash flow projection forecasts, burn rate, break-even charts, and dynamic ROI metrics.',
      path: '/financial-model',
      icon: FiDollarSign,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      name: 'Pitch Deck Builder',
      desc: 'Create structured 10-slide decks with tailored presenter speaker notes and PDF exports.',
      path: '/pitch-deck',
      icon: FiAirplay,
      color: 'from-rose-500 to-pink-650',
    },
    {
      name: 'Startup Coach',
      desc: 'Direct-message our expert AI coach for immediate hiring, legal, and growth guidelines.',
      path: '/startup-coach',
      icon: FiMessageSquare,
      color: 'from-amber-500 to-orange-600',
    },
    {
      name: 'Validation Checklist',
      desc: 'Define validation checklist matrices, customer interview script guides, and MVP goals.',
      path: '/validation',
      icon: FiCheckSquare,
      color: 'from-violet-500 to-purple-700',
    },
  ];

  return (
    <div className="space-y-8 animate-slide-up font-sans">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">SaaS Accelerator Workspace</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Build, validate, model, and launch your startup idea from a single portal.
          </p>
        </div>
        <Link
          to="/business-plan"
          className="inline-flex items-center justify-center px-4 py-2.5 bg-brand hover:bg-brand-dark text-white font-semibold text-sm rounded-xl shadow transition-all duration-200"
        >
          <FiPlus className="w-4 h-4 mr-2" />
          Create New Plan
        </Link>
      </div>

      {/* Grid of SaaS modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod) => {
          const Icon = mod.icon;
          return (
            <Link
              key={mod.name}
              to={mod.path}
              className="glass-card hover:shadow-lg rounded-2xl p-6 transition-all duration-200 border border-slate-200/60 dark:border-slate-800/60 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${mod.color} text-white mb-4 shadow`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-brand dark:group-hover:text-brand-light transition-colors">
                  {mod.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {mod.desc}
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-bold text-slate-450 group-hover:text-brand dark:group-hover:text-brand-light transition-colors">
                Launch Module &rarr;
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Plans list container */}
      <div className="glass-card rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800 dark:text-white">Recent Generated Business Plans</h2>
          <span className="px-2 py-0.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full">
            {plans.length} total
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading plan history...</div>
        ) : error ? (
          <div className="p-12 text-center text-red-400">{error}</div>
        ) : plans.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <p className="text-slate-400 dark:text-slate-500 text-sm">No business plans generated yet.</p>
            <Link
              to="/business-plan"
              className="inline-flex items-center text-xs font-bold text-brand dark:text-brand-light hover:underline"
            >
              Start by typing your business idea &rarr;
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-850">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors"
              >
                <div className="space-y-1 mb-3 sm:mb-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-800 dark:text-white">{plan.name}</span>
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded border border-indigo-100 dark:border-indigo-900">
                      {plan.businessType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 max-w-xl">
                    Idea: {plan.idea}
                  </p>
                  <div className="flex items-center space-x-4 text-[10px] text-slate-400">
                    <span className="flex items-center">
                      <FiCalendar className="w-3.5 h-3.5 mr-1" />
                      {new Date(plan.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </span>
                    <span className="flex items-center">
                      <FiTarget className="w-3.5 h-3.5 mr-1" />
                      Market: {plan.targetMarket}
                    </span>
                  </div>
                </div>

                {/* Operations links */}
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/business-plan?id=${plan._id}`}
                    title="View Report Details"
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-300 transition"
                  >
                    <FiEye className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={(e) => handleDelete(plan._id, e)}
                    title="Delete Plan"
                    className="p-2 rounded-xl border border-red-200/50 hover:bg-red-50 dark:border-red-950/20 dark:hover:bg-red-950/20 text-red-500 dark:text-red-400 transition"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
