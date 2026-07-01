import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getHistory, getPlanById } from '../services/businessApi.js';
import { calculateFinance } from '../services/financeApi.js';
import FinancialChart from '../components/FinancialChart.jsx';
import PDFButton from '../components/PDFButton.jsx';
import { useTheme } from '../hooks/useTheme.js';
import { FiArrowLeft, FiDollarSign, FiPercent, FiTrendingUp, FiActivity, FiBriefcase } from 'react-icons/fi';

const FinancialModel = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const planId = searchParams.get('id');
  const { theme } = useTheme();

  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(planId || '');
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, reset } = useForm();

  // Load plans dropdown
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

  // Fetch plan details & seed form
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
        
        // Seed form fields with existing data or defaults
        const defaults = data.financialReport?.summary || {};
        reset({
          startingCapital: defaults.startingCapital || 50000,
          growthRate: defaults.growthRate || 10,
          monthlyExpense: defaults.monthlyExpense || 5000,
          pricePerCustomer: defaults.pricePerCustomer || 29,
          initialCustomers: defaults.initialCustomers || 100,
          marketingSpend: defaults.marketingSpend || 1000,
          investmentAsk: defaults.investmentAsk || 150000,
          otherExpenses: defaults.otherExpenses || 1500,
        });
      } catch (err) {
        console.error(err);
        setError('Failed to fetch plan metrics.');
      } finally {
        setFetching(false);
      }
    };
    fetchDetails();
  }, [planId, reset]);

  const handlePlanChange = (e) => {
    const val = e.target.value;
    setSelectedPlan(val);
    if (val) {
      setSearchParams({ id: val });
    } else {
      setSearchParams({});
    }
  };

  const onSubmit = async (formData) => {
    if (!planId) return;
    setLoading(true);
    setError('');
    try {
      const resultPlan = await calculateFinance({
        planId,
        ...formData,
      });
      setPlan(resultPlan);
    } catch (err) {
      console.error(err);
      setError('Calculation failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6 animate-slide-up max-w-6xl mx-auto font-sans">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Financial Projections</h1>
            <p className="text-xs text-slate-400 mt-0.5">Model dynamic revenue streams, operational expense forecast, and runway burn-rates.</p>
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

          {plan && plan.financialReport && (
            <PDFButton elementId="financial-model-document" filename={`${plan.name.replace(/\s+/g, '_')}_Financial_Projections.pdf`} />
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-400 bg-red-950/20 border border-red-500/20 rounded-2xl">
          {error}
        </div>
      )}

      {fetching ? (
        <div className="flex justify-center p-12 text-slate-400">Loading plan financials...</div>
      ) : !plan ? (
        <div className="glass-card rounded-2xl p-12 text-center text-slate-400">
          Please select or generate a Business Plan first to model projections.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inputs Panel (Left) */}
          <div className="lg:col-span-1">
            <form onSubmit={handleSubmit(onSubmit)} className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/60 pb-2">
                Modeling Inputs
              </h3>
              
              <div className="space-y-3 text-xs">
                {/* Starting Capital */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-500">Starting Cash Reserves ($)</label>
                  <input
                    type="number"
                    className="w-full bg-white dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-lg p-2 focus:outline-none"
                    {...register('startingCapital')}
                  />
                </div>

                {/* Investment Ask */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-500">Target Investment Ask ($)</label>
                  <input
                    type="number"
                    className="w-full bg-white dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-lg p-2 focus:outline-none"
                    {...register('investmentAsk')}
                  />
                </div>

                {/* Initial Customers */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-500">Initial Customers (Month 1)</label>
                  <input
                    type="number"
                    className="w-full bg-white dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-lg p-2 focus:outline-none"
                    {...register('initialCustomers')}
                  />
                </div>

                {/* Customer Growth Rate */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-500">Customer Growth Rate (% per Mo)</label>
                  <input
                    type="number"
                    className="w-full bg-white dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-lg p-2 focus:outline-none"
                    {...register('growthRate')}
                  />
                </div>

                {/* Price Per Customer */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-500">Avg Monthly Price per User ($)</label>
                  <input
                    type="number"
                    className="w-full bg-white dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-lg p-2 focus:outline-none"
                    {...register('pricePerCustomer')}
                  />
                </div>

                {/* Monthly Base Expense */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-500">Base Operations Expense ($/mo)</label>
                  <input
                    type="number"
                    className="w-full bg-white dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-lg p-2 focus:outline-none"
                    {...register('monthlyExpense')}
                  />
                </div>

                {/* Monthly Marketing Spend */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-500">Marketing & CAC Spend ($/mo)</label>
                  <input
                    type="number"
                    className="w-full bg-white dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-lg p-2 focus:outline-none"
                    {...register('marketingSpend')}
                  />
                </div>

                {/* Other Expenses */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-500">Misc Overheads / Rent ($/mo)</label>
                  <input
                    type="number"
                    className="w-full bg-white dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-lg p-2 focus:outline-none"
                    {...register('otherExpenses')}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow transition"
              >
                {loading ? 'Re-calculating...' : 'Calculate & Save'}
              </button>
            </form>
          </div>

          {/* Outputs & Charts (Right) */}
          <div className="lg:col-span-2 space-y-6">
            {!plan.financialReport ? (
              <div className="glass-card rounded-2xl p-12 text-center text-slate-400 border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex flex-col justify-center h-full">
                <FiDollarSign className="w-12 h-12 mx-auto text-slate-350 dark:text-slate-650 mb-3" />
                <h4 className="font-bold text-slate-800 dark:text-white">Run Calculations</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                  Click 'Calculate & Save' on the left to initialize projection vectors and Recharts maps.
                </p>
              </div>
            ) : (
              <div id="financial-model-document" className="space-y-6">
                {/* Visual Summary Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* Revenue */}
                  <div className="glass-card rounded-xl p-4 text-center border border-slate-200/60 dark:border-slate-800/60 shadow-xs">
                    <FiTrendingUp className="w-5 h-5 mx-auto text-indigo-500 mb-1.5" />
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Year 1 Revenue</span>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-850 dark:text-white mt-1">
                      {formatCurrency(plan.financialReport.summary.yearOneRevenue)}
                    </h3>
                  </div>

                  {/* Net Profit */}
                  <div className="glass-card rounded-xl p-4 text-center border border-slate-200/60 dark:border-slate-800/60 shadow-xs">
                    <FiActivity className="w-5 h-5 mx-auto text-emerald-500 mb-1.5" />
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Year 1 Profit</span>
                    <h3 className="text-sm sm:text-base font-extrabold text-emerald-600 dark:text-emerald-450 mt-1">
                      {formatCurrency(plan.financialReport.summary.yearOneProfit)}
                    </h3>
                  </div>

                  {/* Monthly Burn Rate */}
                  <div className="glass-card rounded-xl p-4 text-center border border-slate-200/60 dark:border-slate-800/60 shadow-xs">
                    <FiDollarSign className="w-5 h-5 mx-auto text-rose-500 mb-1.5" />
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Avg Burn Rate</span>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-850 dark:text-white mt-1">
                      {formatCurrency(plan.financialReport.summary.burnRate)}
                      <span className="text-[9px] font-normal text-slate-400">/mo</span>
                    </h3>
                  </div>

                  {/* ROI */}
                  <div className="glass-card rounded-xl p-4 text-center border border-slate-200/60 dark:border-slate-800/60 shadow-xs">
                    <FiPercent className="w-5 h-5 mx-auto text-amber-500 mb-1.5" />
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Projected ROI</span>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-850 dark:text-white mt-1">
                      {plan.financialReport.summary.roi}%
                    </h3>
                  </div>
                </div>

                {/* Charts */}
                <FinancialChart data={plan.financialReport.projections} theme={theme} />

                {/* Investment multiples */}
                <div className="glass-card rounded-xl p-5 border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex items-center justify-between">
                  <div className="flex items-center space-x-3.5">
                    <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 text-brand dark:text-indigo-400 rounded-xl">
                      <FiBriefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white">Breakeven Thresholds</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Minimum of <strong className="text-indigo-650 dark:text-indigo-400">{plan.financialReport.summary.breakEvenCustomers}</strong> customers are needed to cover baseline monthly overheads.
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Investment Mult.</span>
                    <h3 className="text-base font-extrabold text-slate-800 dark:text-white mt-0.5">
                      {plan.financialReport.summary.investmentReturnMultiple}x
                    </h3>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialModel;
