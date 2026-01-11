
import React from 'react';
import { Calculation } from '../types';

interface HistoryPanelProps {
  history: Calculation[];
  onClear: () => void;
  onSelect: (calc: Calculation) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onClear, onSelect }) => {
  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-100 h-full flex flex-col shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">History</h2>
        {history.length > 0 && (
          <button 
            onClick={onClear}
            className="text-xs text-rose-500 hover:text-rose-600 transition-colors font-medium"
          >
            Clear
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-300 text-center px-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs">No recent calculations</p>
          </div>
        ) : (
          history.map((calc) => (
            <div 
              key={calc.id}
              onClick={() => onSelect(calc)}
              className="group p-3 rounded-2xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all cursor-pointer"
            >
              <div className="text-[10px] text-slate-400 mb-1 mono flex justify-between">
                <span>{new Date(calc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="opacity-0 group-hover:opacity-100 text-indigo-500 transition-opacity">Select</span>
              </div>
              <div className="text-slate-500 text-xs mono truncate mb-1">
                {calc.expression} =
              </div>
              <div className="text-slate-800 text-lg font-medium mono break-all">
                {calc.result}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
