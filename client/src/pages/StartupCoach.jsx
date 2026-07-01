import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { sendMessageToCoach } from '../services/coachApi.js';
import ChatBox from '../components/ChatBox.jsx';
import { FiArrowLeft, FiMessageSquare, FiBookOpen } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const StartupCoach = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [messages, setMessages] = useState([
    {
      sender: 'coach',
      text: `### Hello ${user?.name || 'there'}! I am your AI Startup Coach 🧠

I'm here to provide actionable, strategic advice to help you validate, launch, and scale your startup. 

Choose one of the suggestions below, or type any custom challenge you are currently working on!`,
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (textToSend) => {
    const queryText = textToSend || inputVal;
    if (!queryText.trim()) return;

    // Append user message
    const userMessage = { sender: 'user', text: queryText };
    const updatedHistory = [...messages, userMessage];
    
    setMessages(updatedHistory);
    setInputVal('');
    setLoading(true);

    try {
      // Dispatch chat request to Groq API
      const result = await sendMessageToCoach(updatedHistory);
      
      setMessages([...updatedHistory, { sender: 'coach', text: result.reply }]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...updatedHistory,
        {
          sender: 'coach',
          text: `### Connection Notice ⚠️\n\nI was unable to reach the AI engine. Please verify that your Groq API Key is configured. What other startup questions do you have?`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    { title: 'Growth Marketing', prompt: 'How should I acquire my first 100 B2B customers with $0 marketing budget?' },
    { title: 'Fundraising Prep', prompt: 'What key parameters do Venture Capitalists look for in a Seed-stage financial plan?' },
    { title: 'Legal & Vesting', prompt: 'How do I structure co-founder equity vesting schedules to prevent disputes?' },
    { title: 'Scaling Team', prompt: 'When is the right time to hire a senior product developer vs outsourcing in a pre-seed startup?' },
  ];

  return (
    <div className="space-y-6 animate-slide-up max-w-4xl mx-auto font-sans">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">AI Startup Coach</h1>
            <p className="text-xs text-slate-450 mt-0.5">Receive personalized mentoring on fundraising, team scaling, and strategy.</p>
          </div>
        </div>
      </div>

      {/* Main Grid Layout: Chat Frame + Sidebar Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Suggestion Chips & Guides (Left Column) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-card rounded-2xl p-5 border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center">
              <FiBookOpen className="w-4 h-4 mr-1.5" />
              Starting Prompts
            </h3>
            
            <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto no-scrollbar py-1">
              {suggestions.map((item) => (
                <button
                  key={item.title}
                  onClick={() => handleSendMessage(item.prompt)}
                  disabled={loading}
                  className="flex-1 lg:flex-none text-left px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 hover:border-brand/40 hover:bg-white dark:hover:bg-slate-800 text-xs font-semibold rounded-xl transition duration-150 whitespace-nowrap lg:whitespace-normal"
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-slate-200/60 dark:border-slate-800/60 shadow-sm hidden lg:block text-xs leading-relaxed text-slate-500">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center">
              <FiMessageSquare className="w-3.5 h-3.5 mr-1 text-indigo-500" />
              Chat Advisory Tip
            </h4>
            Provide specific inputs (business type, budget, active stage) so the coach can tailor answers directly to your context.
          </div>
        </div>

        {/* Chat Feed Box (Right Column) */}
        <div className="lg:col-span-3">
          <ChatBox
            messages={messages}
            inputVal={inputVal}
            onInputChange={setInputVal}
            onSendMessage={() => handleSendMessage()}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default StartupCoach;
