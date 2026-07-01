import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getHistory, getPlanById, checkValidation } from '../services/businessApi.js';
import Loading from '../components/Loading.jsx';
import ValidationChecklist from '../components/ValidationChecklist.jsx';
import PDFButton from '../components/PDFButton.jsx';
import { FiArrowLeft, FiCheckSquare, FiMessageCircle, FiTrendingUp, FiActivity, FiFlag } from 'react-icons/fi';

const Validation = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const planId = searchParams.get('id');

  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(planId || '');
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');

  // Fetch plan history dropdown list
  useEffect(() => {
    const fetchHistoryList = async () => {
      try {
        const data = await getHistory();
        setPlans(data);
        if (data.length > 0 && !planId) {
          setSelectedPlan(data[0]._id);
          setSearchParams({ id: data[0]._id });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchHistoryList();
  }, []);

  // Fetch plan details
  useEffect(() => {
    const fetchDetails = async () => {
      if (!planId) {
        setPlan(null);
        return;
      }
      try {
        setFetching(true);
        setError('');
        const data = await getPlanById(planId);
        setPlan(data);
        setSelectedPlan(planId);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch plan metrics.');
      } finally {
        setFetching(false);
      }
    };
    fetchDetails();
  }, [planId]);

  const handlePlanChange = (e) => {
    const val = e.target.value;
    setSelectedPlan(val);
    if (val) {
      setSearchParams({ id: val });
    } else {
      setSearchParams({});
    }
  };

  const handleGenerateValidation = async () => {
    if (!planId) return;
    setLoading(true);
    setError('');
    try {
      const resultPlan = await checkValidation(planId);
      setPlan(resultPlan);
    } catch (err) {
      console.error(err);
      setError('AI generation failed. Please verify API key.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="LaunchForge AI is compiling your startup validation program. Sourcing customer interview scripts, lean MVP features list, and launch key performance metrics..." fullPage />;
  }

  const v = plan?.validationReport || {};

  return (
    <div className="space-y-6 animate-slide-up max-w-5xl mx-auto font-sans">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-550 hover:text-slate-700 dark:hover:text-slate-350 transition"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Validation & Launch Planner</h1>
            <p className="text-xs text-slate-450 mt-0.5">Validate business assumptions, map customer surveys, and track launch KPIs.</p>
          </div>
        </div>

        {/* Dropdown selectors */}
        <div className="flex items-center space-x-3">
          <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">Active Plan:</label>
          <select
            value={selectedPlan}
            onChange={handlePlanChange}
            className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 text-xs font-semibold rounded-xl py-2 px-3 focus:outline-none"
          >
            <option value="">Select Plan...</option>
            {plans.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>

          {plan && plan.validationReport && (
            <PDFButton elementId="validation-checklist-document" filename={`${plan.name.replace(/\s+/g, '_')}_Validation_Plan.pdf`} />
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-400 bg-red-950/20 border border-red-500/20 rounded-2xl">
          {error}
        </div>
      )}

      {/* Main Core Display */}
      {fetching ? (
        <div className="flex justify-center p-12 text-slate-400">Loading plan validation metrics...</div>
      ) : !plan ? (
        <div className="glass-card rounded-2xl p-12 text-center text-slate-400">
          Please select or generate a Business Plan first to view validation details.
        </div>
      ) : !plan.validationReport ? (
        <div className="glass-card rounded-3xl p-8 sm:p-12 text-center space-y-6 border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
          <div className="p-4 bg-brand/10 dark:bg-indigo-950/30 text-brand dark:text-indigo-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-2xl">
            <FiCheckSquare className="w-6 h-6" />
          </div>
          <div className="space-y-2 max-w-sm mx-auto">
            <h2 className="text-lg font-bold text-slate-850 dark:text-white">Run Assumptions Validation</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Compile validation tasks, custom interview templates, and launch KPIs tailored to <strong>{plan.name}</strong>.
            </p>
          </div>
          <button
            onClick={handleGenerateValidation}
            className="px-6 py-3 bg-brand hover:bg-brand-dark dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow transition"
          >
            Create Validation Planner
          </button>
        </div>
      ) : (
        <div id="validation-checklist-document" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Validation Checklist (Left Column) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-2xl p-5 border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center">
                <FiCheckSquare className="w-5 h-5 mr-2 text-indigo-500" />
                Lean Validation Checklist
              </h2>
              <ValidationChecklist tasks={v.validationChecklist} />
            </div>

            {/* Launch Milestones */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center">
                <FiFlag className="w-5 h-5 mr-2 text-brand" />
                Go-To-Market & Launch Plan
              </h2>
              <div className="divide-y divide-slate-100 dark:divide-slate-850">
                {v.launchChecklist?.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-start justify-between text-xs sm:text-sm">
                    <span className="text-slate-655 dark:text-slate-350 pr-4">{item.task}</span>
                    <span className="px-2 py-0.5 font-bold uppercase tracking-wide text-[9px] bg-slate-100 dark:bg-slate-850 text-slate-500 rounded whitespace-nowrap">
                      {item.stage}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interview scripts & metrics (Right Column) */}
          <div className="space-y-6">
            {/* Customer Interview Questions */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center">
                <FiMessageCircle className="w-5 h-5 mr-2 text-indigo-550" />
                Customer Survey Scripts
              </h2>
              <div className="space-y-3">
                {v.customerInterviewQuestions?.map((q, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-850 rounded-xl">
                    <p className="text-xs text-slate-655 dark:text-slate-300 leading-relaxed font-medium">"{q}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* MVP Scope Blueprint */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-slate-800 dark:text-white">Minimum Viable Product (MVP) Plan</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                {v.mvpPlanning}
              </p>
            </div>

            {/* GTM & Risk Analysis */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-slate-800 dark:text-white">Go-To-Market Execution</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-line font-medium text-brand dark:text-indigo-400">
                GTM Approach: {v.goToMarketStrategy}
              </p>
              <div className="border-t border-slate-200/50 dark:border-slate-800/60 pt-3 space-y-1">
                <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wide">Risk Assessment:</span>
                <p className="text-xs text-slate-450">{v.riskAssessment}</p>
              </div>
            </div>

            {/* KPIs & Early Metrics */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center">
                <FiTrendingUp className="w-5 h-5 mr-2 text-emerald-500" />
                Validation KPIs & Metrics
              </h2>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-bold text-slate-400">Early Signal Metrics:</span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {v.earlyMetrics?.map((m) => (
                      <span key={m} className="px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 font-semibold text-[10px]">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-400">Success Targets (KPIs):</span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {v.successKpis?.map((kpi) => (
                      <span key={kpi} className="px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-semibold text-[10px]">
                        {kpi}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Validation;
