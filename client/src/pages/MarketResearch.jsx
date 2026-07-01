import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getHistory, getPlanById } from '../services/businessApi.js';
import { analyzeMarket } from '../services/marketApi.js';
import Loading from '../components/Loading.jsx';
import SWOTCard from '../components/SWOTCard.jsx';
import PDFButton from '../components/PDFButton.jsx';
import { FiArrowLeft, FiCompass, FiTarget, FiUser, FiInfo, FiLayers } from 'react-icons/fi';

const MarketResearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const planId = searchParams.get('id');

  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(planId || '');
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');

  // Fetch dropdown list
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

  // Fetch plan details when planId changes
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

  const handleGenerateResearch = async () => {
    if (!planId) return;
    setLoading(true);
    setError('');
    try {
      const updatedPlan = await analyzeMarket(planId);
      setPlan(updatedPlan);
    } catch (err) {
      console.error(err);
      setError('AI generation failed. Please check your key or connection.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="LaunchForge AI is gathering competitive benchmarks, SWOT matrices, PESTLE constraints, and target customer personas..." fullPage />;
  }

  return (
    <div className="space-y-6 animate-slide-up max-w-5xl mx-auto font-sans">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Market Research & SWOT</h1>
            <p className="text-xs text-slate-400 mt-0.5">Analyze target customer demography, competitors, and trends.</p>
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

          {plan && plan.marketReport && (
            <PDFButton elementId="market-research-document" filename={`${plan.name.replace(/\s+/g, '_')}_Market_Research.pdf`} />
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
        <div className="flex justify-center p-12 text-slate-400">Loading plan market data...</div>
      ) : !plan ? (
        <div className="glass-card rounded-2xl p-12 text-center text-slate-400">
          Please select or generate a Business Plan first to analyze its target market.
        </div>
      ) : !plan.marketReport ? (
        <div className="glass-card rounded-3xl p-8 sm:p-12 text-center space-y-6 border border-slate-200/60 dark:border-slate-800/60">
          <div className="p-4 bg-brand/10 dark:bg-indigo-950/30 text-brand dark:text-indigo-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-2xl">
            <FiCompass />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-lg font-bold text-slate-850 dark:text-white">Run AI Market Intelligence</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Compile customer personas, TAM sizing metrics, industry regulatory factors, PESTLE, and SWOT grids tailored to <strong>{plan.name}</strong>.
            </p>
          </div>
          <button
            onClick={handleGenerateResearch}
            className="px-6 py-3 bg-brand hover:bg-brand-dark dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md transition"
          >
            Start Market Analysis
          </button>
        </div>
      ) : (
        <div id="market-research-document" className="space-y-6">
          {/* Market Size TAM SAM SOM */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center">
              <FiTarget className="w-4.5 h-4.5 mr-2 text-brand" />
              1. Market Size & Demographics
            </h2>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/30 text-sm text-slate-655 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {plan.marketReport.marketSize}
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/30 text-sm text-slate-655 dark:text-slate-300 leading-relaxed">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Target Audience Persona:</h4>
              <p className="whitespace-pre-line">{plan.marketReport.targetAudience}</p>
            </div>
          </div>

          {/* SWOT Card Grid */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center">
              <FiLayers className="w-4.5 h-4.5 mr-2 text-indigo-500" />
              2. SWOT Strategic Grid
            </h2>
            <SWOTCard swot={plan.marketReport.swotAnalysis} />
          </div>

          {/* PESTLE Grid Cards */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center">
              <FiInfo className="w-4.5 h-4.5 mr-2 text-indigo-500" />
              3. PESTLE External Analysis
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Object.entries(plan.marketReport.pestleAnalysis || {}).map(([key, value]) => (
                <div key={key} className="glass-card rounded-2xl p-5 border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-2">
                  <h4 className="text-xs font-bold uppercase text-brand dark:text-indigo-400 tracking-wide">{key}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Personas Cards */}
          {plan.marketReport.customerPersonas && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center">
                <FiUser className="w-4.5 h-4.5 mr-2 text-brand" />
                4. Primary Customer Personas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plan.marketReport.customerPersonas.map((persona, index) => (
                  <div key={index} className="glass-card rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-brand/10 text-brand font-semibold text-sm rounded-full flex items-center justify-center">
                        {persona.name ? persona.name[0] : 'P'}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-200">{persona.name}</h4>
                        <p className="text-[10px] text-slate-400">{persona.demographics}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                      <div className="space-y-1">
                        <span className="font-bold text-slate-500">Pain Points:</span>
                        <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-450">
                          {persona.painPoints?.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                      </div>
                      <div className="space-y-1">
                        <span className="font-bold text-slate-500">Goals:</span>
                        <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-450">
                          {persona.goals?.map((g, i) => <li key={i}>{g}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Industry Trends, Opportunities & Challenges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Trends & Opportunities */}
            <div className="glass-card rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Industry Trends & Opportunities</h3>
              <ul className="space-y-2 list-disc pl-5 text-sm text-slate-655 dark:text-slate-400">
                {plan.marketReport.industryTrends?.map((trend, idx) => (
                  <li key={idx}>{trend}</li>
                ))}
                {plan.marketReport.growthOpportunities?.map((opp, idx) => (
                  <li key={idx} className="text-emerald-600 dark:text-emerald-400 font-medium">{opp}</li>
                ))}
              </ul>
            </div>

            {/* Competitor Landscape & Challenges */}
            <div className="glass-card rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Competitor Challenges & Compliance</h3>
              <p className="text-sm text-slate-655 dark:text-slate-450 leading-relaxed">
                {plan.marketReport.competitorAnalysis}
              </p>
              <div className="border-t border-slate-200/50 dark:border-slate-800/60 pt-3 space-y-2 text-xs">
                <span className="font-bold text-rose-500">Regulatory factors & roadblocks:</span>
                <p className="text-slate-500 dark:text-slate-450">{plan.marketReport.regulatoryRequirements}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketResearch;
