
import React, { useState, useRef, useEffect } from 'react';
import { solveNaturalLanguageMath } from '../services/geminiService';

export const AiAssistant: React.FC = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSolve = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim() || isLoading) return;

    const currentQuery = query;
    setMessages(prev => [...prev, { role: 'user', content: currentQuery }]);
    setQuery('');
    setIsLoading(true);

    const result = await solveNaturalLanguageMath(currentQuery);
    setMessages(prev => [...prev, { role: 'ai', content: result }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="p-6 border-b border-slate-50 bg-slate-50/50">
        <h3 className="text-slate-800 font-semibold flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
          AI Math Assistant
        </h3>
        <p className="text-xs text-slate-400 mt-1">Ask complex math questions in plain English.</p>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/20"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center gap-4 px-8">
            <div className="p-4 rounded-3xl bg-indigo-50 text-indigo-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-slate-600">How can I help you today?</p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {['Split $250 bill by 4 with 15% tip', '55 mph to km/h', 'Area of circle with radius 12'].map(suggestion => (
                  <button 
                    key={suggestion}
                    onClick={() => setQuery(suggestion)}
                    className="text-[10px] bg-white border border-slate-200 px-3 py-1.5 rounded-full hover:border-indigo-300 transition-all text-slate-500"
                  >
                    "{suggestion}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`
                max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed
                ${m.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none shadow-md' 
                  : 'bg-white text-slate-700 rounded-bl-none shadow-sm border border-slate-100'
                }
              `}>
                {m.content}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-3xl rounded-bl-none shadow-sm border border-slate-100">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSolve} className="p-6 bg-white border-t border-slate-100">
        <div className="relative flex items-center">
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your question..."
            className="w-full bg-slate-100 rounded-2xl py-3 px-5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all border-none"
          />
          <button 
            type="submit"
            disabled={!query.trim() || isLoading}
            className={`
              absolute right-2 p-2 rounded-xl transition-all
              ${!query.trim() || isLoading ? 'text-slate-300' : 'text-indigo-600 hover:bg-indigo-50'}
            `}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};
