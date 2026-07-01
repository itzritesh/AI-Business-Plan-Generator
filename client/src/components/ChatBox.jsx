import React, { useEffect, useRef } from 'react';
import { FiSend } from 'react-icons/fi';

const ChatBox = ({ messages = [], inputVal, onInputChange, onSendMessage, loading }) => {
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Helper to parse simple markdown titles and bold tags from the AI coach responses
  const renderMessageContent = (text) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Titles (### Title)
      if (line.trim().startsWith('###')) {
        return (
          <h4 key={idx} className="text-sm font-bold text-slate-800 dark:text-white mt-3 mb-1.5 first:mt-0">
            {line.replace('###', '').trim()}
          </h4>
        );
      }
      
      // Bullet points (1. or -)
      if (line.trim().startsWith('-') || line.trim().startsWith('*') || /^\d+\./.test(line.trim())) {
        const cleanedLine = line.replace(/^[-*\d.]+\s*/, '');
        return (
          <div key={idx} className="flex items-start text-xs sm:text-sm pl-2 my-1 leading-relaxed">
            <span className="text-brand mr-2 mt-1">&#8226;</span>
            <span>{parseBoldText(cleanedLine)}</span>
          </div>
        );
      }

      // Normal paragraph
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="text-xs sm:text-sm leading-relaxed my-1">
          {parseBoldText(line)}
        </p>
      );
    });
  };

  // Replace **text** with <strong>text</strong>
  const parseBoldText = (text) => {
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, index) => {
      return index % 2 === 1 ? <strong key={index} className="font-semibold text-slate-900 dark:text-white">{part}</strong> : part;
    });
  };

  return (
    <div className="flex flex-col h-[500px] sm:h-[600px] border border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/40 rounded-2xl shadow-sm overflow-hidden backdrop-blur-sm">
      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3">
            <div className="p-4 bg-brand/10 text-brand dark:bg-indigo-950/30 dark:text-indigo-400 rounded-full text-3xl">
              🧠
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Welcome to Startup Coaching</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 leading-relaxed">
                Choose a topic below or type any business question: marketing, fundraising, hiring, scaling, or legal basics.
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isUser = msg.sender === 'user';
            return (
              <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-sm border
                    ${isUser
                      ? 'bg-brand dark:bg-indigo-650 border-brand/10 dark:border-indigo-600 text-white rounded-br-none'
                      : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800/80 text-slate-800 dark:text-slate-200 rounded-bl-none'
                    }
                  `}
                >
                  {isUser ? (
                    <p className="text-xs sm:text-sm leading-relaxed">{msg.text}</p>
                  ) : (
                    <div className="space-y-1">{renderMessageContent(msg.text)}</div>
                  )}
                </div>
              </div>
            );
          })
        )}
        
        {/* Loading Bubble */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800/80 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
              <div className="flex items-center space-x-1.5 py-1">
                <div className="w-2.5 h-2.5 bg-slate-350 dark:bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2.5 h-2.5 bg-slate-350 dark:bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2.5 h-2.5 bg-slate-350 dark:bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input controls */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSendMessage();
        }}
        className="p-3 border-t border-slate-200/60 dark:border-slate-850 bg-white dark:bg-slate-900/60 flex items-center space-x-2"
      >
        <input
          value={inputVal}
          onChange={(e) => onInputChange(e.target.value)}
          disabled={loading}
          type="text"
          placeholder="Ask about marketing strategy, vesting schedules, pitch deck models..."
          className="flex-1 glass-input rounded-xl px-4 py-2.5 text-sm disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !inputVal.trim()}
          className="p-2.5 rounded-xl bg-brand dark:bg-indigo-600 hover:bg-brand-dark dark:hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow transition-all duration-150"
        >
          <FiSend className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
