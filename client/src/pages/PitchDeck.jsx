import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getHistory, getPlanById, generatePitchDeck } from '../services/businessApi.js';
import Loading from '../components/Loading.jsx';
import PitchSlide from '../components/PitchSlide.jsx';
import PDFButton from '../components/PDFButton.jsx';
import { FiArrowLeft, FiAirplay, FiChevronLeft, FiChevronRight, FiGrid } from 'react-icons/fi';

const PitchDeck = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const planId = searchParams.get('id');

  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(planId || '');
  const [plan, setPlan] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
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
        setCurrentSlideIndex(0); // Reset carousel on load
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

  const handleGenerateDeck = async () => {
    if (!planId) return;
    setLoading(true);
    setError('');
    try {
      const resultPlan = await generatePitchDeck(planId);
      setPlan(resultPlan);
    } catch (err) {
      console.error(err);
      setError('AI generation failed. Please verify API key.');
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    if (plan && plan.pitchDeck && currentSlideIndex < plan.pitchDeck.slides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  if (loading) {
    return <Loading message="LaunchForge AI is designing your 10-slide presentation deck. Drafting investor-grade problem definitions, TAM opportunities, and product roadmap milestones..." fullPage />;
  }

  const slidesList = plan?.pitchDeck?.slides || [];
  const currentSlide = slidesList[currentSlideIndex];

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
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">AI Pitch Deck Builder</h1>
            <p className="text-xs text-slate-450 mt-0.5">Structured pitch presentation layouts targeting Venture Capitalists.</p>
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

          {plan && plan.pitchDeck && (
            <PDFButton
              elementId="pitch-deck-carousel-container"
              filename={`${plan.name.replace(/\s+/g, '_')}_Pitch_Deck.pdf`}
              orientation="l" // Horizontal presentation print layout!
              label="Export PDF (Landscape)"
            />
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
        <div className="flex justify-center p-12 text-slate-400">Loading plan presentation...</div>
      ) : !plan ? (
        <div className="glass-card rounded-2xl p-12 text-center text-slate-400">
          Please select or generate a Business Plan first to build a pitch deck.
        </div>
      ) : !plan.pitchDeck ? (
        <div className="glass-card rounded-3xl p-8 sm:p-12 text-center space-y-6 border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
          <div className="p-4 bg-brand/10 dark:bg-indigo-950/30 text-brand dark:text-indigo-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-2xl">
            <FiAirplay />
          </div>
          <div className="space-y-2 max-w-sm mx-auto">
            <h2 className="text-lg font-bold text-slate-850 dark:text-white">Design AI Pitch Slides</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Compile a complete 10-slide outline for <strong>{plan.name}</strong>, complete with tailored slide bullets and speaker notes.
            </p>
          </div>
          <button
            onClick={handleGenerateDeck}
            className="px-6 py-3 bg-brand hover:bg-brand-dark dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow transition"
          >
            Generate Pitch Deck
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active slide view container */}
          <div id="pitch-deck-carousel-container" className="p-1.5 rounded-3xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-900">
            <PitchSlide slide={currentSlide} />
          </div>

          {/* Navigation Controls Bar */}
          <div className="glass-card rounded-2xl p-4 flex items-center justify-between border border-slate-200/60 dark:border-slate-800/60 shadow-xs">
            <button
              onClick={prevSlide}
              disabled={currentSlideIndex === 0}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 disabled:opacity-40 transition-opacity hover:bg-slate-50 dark:hover:bg-slate-850"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots navigation tracker */}
            <div className="flex items-center space-x-1.5 overflow-x-auto max-w-xs sm:max-w-md">
              {slidesList.map((slide, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`w-7 h-7 flex items-center justify-center text-xs font-semibold rounded-full border transition-all
                    ${
                      currentSlideIndex === idx
                        ? 'bg-slate-900 border-slate-900 text-white dark:bg-indigo-650 dark:border-indigo-650'
                        : 'bg-white border-slate-200 text-slate-550 dark:bg-slate-900 dark:border-slate-850 hover:bg-slate-50'
                    }
                  `}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button
              onClick={nextSlide}
              disabled={currentSlideIndex === slidesList.length - 1}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 disabled:opacity-40 transition-opacity hover:bg-slate-50 dark:hover:bg-slate-850"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PitchDeck;
