import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { generatePlan, getPlanById } from '../services/businessApi.js';
import Loading from '../components/Loading.jsx';
import PDFButton from '../components/PDFButton.jsx';
import { FiArrowLeft, FiFileText, FiAward, FiPieChart, FiTrendingUp, FiSettings } from 'react-icons/fi';

const BusinessPlan = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const planId = searchParams.get('id');

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const [apiError, setApiError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchPlanDetails = async () => {
      if (!planId) {
        setPlan(null);
        return;
      }

      try {
        setFetching(true);
        const data = await getPlanById(planId);
        setPlan(data);
      } catch (err) {
        console.error(err);
        setApiError('Failed to retrieve the business plan details.');
      } finally {
        setFetching(false);
      }
    };

    fetchPlanDetails();
  }, [planId]);

  const onSubmit = async (formData) => {
    setLoading(true);
    setApiError('');
    try {
      const result = await generatePlan(formData);
      setPlan(result);
      setSearchParams({ id: result._id });
    } catch (err) {
      console.error(err);
      setApiError('AI compilation failed. Please check your network or try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="LaunchForge AI is generating your 18-part business plan. Crafting financial targets, hiring forecasts, and SWOT profiles..." fullPage />;
  }

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-slate-500">Retrieving business plan report...</p>
      </div>
    );
  }

  // Render Form Wizard if no plan is selected
  if (!plan) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-slide-up font-sans">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition"
        >
          <FiArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Dashboard
        </button>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">AI Business Plan Generator</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Provide key parameters, and our AI compiler will draft a comprehensive, production-ready business report.
          </p>
        </div>

        {apiError && (
          <div className="p-4 text-sm text-red-400 bg-red-950/20 border border-red-500/20 rounded-2xl">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Company Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Company / Project Name</label>
              <input
                placeholder="e.g. LaunchForge Inc"
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-xl py-2.5 px-3.5 text-sm transition"
                {...register('name', { required: 'Company name is required' })}
              />
              {errors.name && <span className="text-[10px] text-red-450">{errors.name.message}</span>}
            </div>

            {/* Business Type */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Business Sector / Type</label>
              <select
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-xl py-2.5 px-3.5 text-sm transition"
                {...register('businessType', { required: 'Business type is required' })}
              >
                <option value="SaaS Software">SaaS Software</option>
                <option value="B2B E-Commerce">B2B E-Commerce</option>
                <option value="Fintech Platform">Fintech Platform</option>
                <option value="Healthtech AI">Healthtech AI</option>
                <option value="AI Developer Tools">AI Developer Tools</option>
                <option value="Edtech Marketplace">Edtech Marketplace</option>
                <option value="Other / Custom">Other / Custom</option>
              </select>
            </div>

            {/* Target Market */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Target Audience / Market</label>
              <input
                placeholder="e.g. Seed-stage startup founders worldwide"
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-xl py-2.5 px-3.5 text-sm transition"
                {...register('targetMarket', { required: 'Target market is required' })}
              />
              {errors.targetMarket && <span className="text-[10px] text-red-450">{errors.targetMarket.message}</span>}
            </div>

            {/* Revenue Model */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Revenue / Pricing Model</label>
              <select
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-xl py-2.5 px-3.5 text-sm transition"
                {...register('revenueModel', { required: 'Revenue model is required' })}
              >
                <option value="Subscription SaaS">Subscription SaaS</option>
                <option value="Usage-based Pricing">Usage-based Pricing</option>
                <option value="Marketplace Commission">Marketplace Commission</option>
                <option value="Freemium Premium tiers">Freemium Premium tiers</option>
                <option value="Direct Enterprise Sales">Direct Enterprise Sales</option>
              </select>
            </div>

            {/* Funding Stage */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Active Funding Stage</label>
              <select
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-xl py-2.5 px-3.5 text-sm transition"
                {...register('fundingStage', { required: 'Funding stage is required' })}
              >
                <option value="Bootstrap (Self-funded)">Bootstrap (Self-funded)</option>
                <option value="Pre-Seed (Friends & Family)">Pre-Seed (Friends & Family)</option>
                <option value="Seed Round ($500k - $2M)">Seed Round ($500k - $2M)</option>
                <option value="Series A ($2M - $10M)">Series A ($2M - $10M)</option>
              </select>
            </div>

            {/* Business Idea Description */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Startup Idea / Core Product Description</label>
              <textarea
                rows={4}
                placeholder="Detail what you are building, how it solves key target pain points, and why it's better than competitors..."
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-xl py-2.5 px-3.5 text-sm transition"
                {...register('idea', { required: 'Business description is required' })}
              />
              {errors.idea && <span className="text-[10px] text-red-450">{errors.idea.message}</span>}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-750 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition"
          >
            Compile Business Plan via AI
          </button>
        </form>
      </div>
    );
  }

  // Chapters definitions for tabs
  const r = plan.generatedReport || {};

  const tabs = [
    { id: 'summary', name: 'Executive & Overview', icon: FiAward },
    { id: 'solution', name: 'Problem & Solution', icon: FiFileText },
    { id: 'market', name: 'Market & Strategy', icon: FiPieChart },
    { id: 'operations', name: 'Operations & Team', icon: FiSettings },
    { id: 'growth', name: 'Growth & Funding', icon: FiTrendingUp },
  ];

  return (
    <div className="space-y-6 animate-slide-up max-w-5xl mx-auto font-sans">
      {/* Detail Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSearchParams({})}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-550 hover:text-slate-700 dark:hover:text-slate-350 transition"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">{plan.name}</h1>
            <p className="text-xs text-slate-400 mt-0.5">Sector: {plan.businessType} &bull; Stage: {plan.fundingStage}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Quick Module redirects */}
          <button
            onClick={() => navigate(`/market-research?id=${plan._id}`)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-indigo-500/20 text-indigo-650 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition"
          >
            Market Research
          </button>
          <button
            onClick={() => navigate(`/financial-model?id=${plan._id}`)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-emerald-500/20 text-emerald-650 dark:text-emerald-450 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition"
          >
            Financial Model
          </button>
          
          <PDFButton elementId="business-plan-document" filename={`${plan.name.replace(/\s+/g, '_')}_Business_Plan.pdf`} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800/80 overflow-x-auto no-scrollbar py-1 space-x-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all border whitespace-nowrap
                ${isActive
                  ? 'bg-slate-900 border-slate-900 text-white dark:bg-indigo-600 dark:border-indigo-600'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-850'
                }
              `}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Report Document container */}
      <div
        id="business-plan-document"
        className="glass-card rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm border border-slate-200/60 dark:border-slate-800/60 space-y-8 min-h-[500px]"
      >
        {activeTab === 'summary' && (
          <div className="space-y-6">
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-850 pb-2">1. Executive Summary</h2>
              <p className="text-sm text-slate-655 dark:text-slate-350 leading-relaxed whitespace-pre-line">{r.executiveSummary}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-850 pb-2">2. Company Overview</h2>
              <p className="text-sm text-slate-655 dark:text-slate-350 leading-relaxed whitespace-pre-line">{r.companyOverview}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-850 pb-2">3. Conclusion</h2>
              <p className="text-sm text-slate-655 dark:text-slate-350 leading-relaxed whitespace-pre-line">{r.conclusion}</p>
            </section>
          </div>
        )}

        {activeTab === 'solution' && (
          <div className="space-y-6">
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-850 pb-2">4. Problem Statement</h2>
              <p className="text-sm text-slate-655 dark:text-slate-350 leading-relaxed whitespace-pre-line">{r.problemStatement}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-850 pb-2">5. Solution</h2>
              <p className="text-sm text-slate-655 dark:text-slate-350 leading-relaxed whitespace-pre-line">{r.solution}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-850 pb-2">6. Technology Stack</h2>
              <p className="text-sm text-slate-655 dark:text-slate-350 leading-relaxed whitespace-pre-line">{r.technologyStack}</p>
            </section>
          </div>
        )}

        {activeTab === 'market' && (
          <div className="space-y-6">
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-850 pb-2">7. Target Customers</h2>
              <p className="text-sm text-slate-655 dark:text-slate-350 leading-relaxed whitespace-pre-line">{r.targetCustomers}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-850 pb-2">8. Market Analysis</h2>
              <p className="text-sm text-slate-655 dark:text-slate-350 leading-relaxed whitespace-pre-line">{r.marketAnalysis}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-850 pb-2">9. Competitive Analysis</h2>
              <p className="text-sm text-slate-655 dark:text-slate-350 leading-relaxed whitespace-pre-line">{r.competitiveAnalysis}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-850 pb-2">10. Marketing Strategy</h2>
              <p className="text-sm text-slate-655 dark:text-slate-350 leading-relaxed whitespace-pre-line">{r.marketingStrategy}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-850 pb-2">11. Sales Strategy</h2>
              <p className="text-sm text-slate-655 dark:text-slate-350 leading-relaxed whitespace-pre-line">{r.salesStrategy}</p>
            </section>
          </div>
        )}

        {activeTab === 'operations' && (
          <div className="space-y-6">
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-850 pb-2">12. Operations Plan</h2>
              <p className="text-sm text-slate-655 dark:text-slate-350 leading-relaxed whitespace-pre-line">{r.operationsPlan}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-850 pb-2">13. Hiring Requirements</h2>
              <p className="text-sm text-slate-655 dark:text-slate-350 leading-relaxed whitespace-pre-line">{r.hiringRequirements}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-850 pb-2">14. Risk Analysis</h2>
              <p className="text-sm text-slate-655 dark:text-slate-350 leading-relaxed whitespace-pre-line">{r.riskAnalysis}</p>
            </section>
          </div>
        )}

        {activeTab === 'growth' && (
          <div className="space-y-6">
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-850 pb-2">15. Revenue Model</h2>
              <p className="text-sm text-slate-655 dark:text-slate-350 leading-relaxed whitespace-pre-line">{r.revenueModel}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-850 pb-2">16. Financial Projection</h2>
              <p className="text-sm text-slate-655 dark:text-slate-350 leading-relaxed whitespace-pre-line">{r.financialProjection}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-850 pb-2">17. 5-Year Growth Plan</h2>
              <p className="text-sm text-slate-655 dark:text-slate-350 leading-relaxed whitespace-pre-line">{r.fiveYearGrowthPlan}</p>
            </section>
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-850 pb-2">18. Funding Requirements</h2>
              <p className="text-sm text-slate-655 dark:text-slate-350 leading-relaxed whitespace-pre-line">{r.fundingRequirements}</p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessPlan;
