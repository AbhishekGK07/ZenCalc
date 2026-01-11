
import React from 'react';
import { Operator } from '../types';

interface CalculatorProps {
  currentValue: string;
  previousValue: string;
  operator: Operator;
  onAction: (type: string, value?: string) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ 
  currentValue, 
  previousValue, 
  operator, 
  onAction 
}) => {
  const formatValue = (val: string) => {
    if (!val) return '0';
    const [int, dec] = val.split('.');
    const formattedInt = parseInt(int).toLocaleString();
    return dec !== undefined ? `${formattedInt}.${dec}` : formattedInt;
  };

  const buttons = [
    { label: 'AC', type: 'CLEAR', class: 'text-rose-500 font-semibold' },
    { label: '+/-', type: 'TOGGLE_SIGN', class: 'text-slate-500' },
    { label: '%', type: 'PERCENT', class: 'text-slate-500' },
    { label: '÷', type: 'OPERATOR', value: '/', class: 'text-indigo-600 font-bold bg-indigo-50' },
    
    { label: '7', type: 'DIGIT', value: '7' },
    { label: '8', type: 'DIGIT', value: '8' },
    { label: '9', type: 'DIGIT', value: '9' },
    { label: '×', type: 'OPERATOR', value: '*', class: 'text-indigo-600 font-bold bg-indigo-50' },
    
    { label: '4', type: 'DIGIT', value: '4' },
    { label: '5', type: 'DIGIT', value: '5' },
    { label: '6', type: 'DIGIT', value: '6' },
    { label: '−', type: 'OPERATOR', value: '-', class: 'text-indigo-600 font-bold bg-indigo-50' },
    
    { label: '1', type: 'DIGIT', value: '1' },
    { label: '2', type: 'DIGIT', value: '2' },
    { label: '3', type: 'DIGIT', value: '3' },
    { label: '+', type: 'OPERATOR', value: '+', class: 'text-indigo-600 font-bold bg-indigo-50' },
    
    { label: '0', type: 'DIGIT', value: '0', span: 'col-span-2' },
    { label: '.', type: 'DIGIT', value: '.' },
    { label: '=', type: 'EQUALS', class: 'bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-indigo-200' },
  ];

  return (
    <div className="flex flex-col h-full p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Display */}
      <div className="flex-1 flex flex-col justify-end items-end pb-8 min-h-[160px]">
        <div className="text-slate-400 text-sm mb-2 mono h-6 overflow-hidden transition-all">
          {previousValue && `${formatValue(previousValue)} ${operator || ''}`}
        </div>
        <div className="text-5xl md:text-6xl font-light text-slate-800 tracking-tight break-all text-right mono leading-tight transition-all duration-300">
          {formatValue(currentValue)}
        </div>
      </div>

      {/* Button Grid */}
      <div className="grid grid-cols-4 gap-3">
        {buttons.map((btn, idx) => (
          <button
            key={idx}
            onClick={() => onAction(btn.type, btn.value)}
            className={`
              h-16 md:h-20 rounded-2xl flex items-center justify-center text-xl transition-all duration-200
              active:scale-95 active:bg-slate-200
              ${btn.span || ''}
              ${btn.class || 'bg-slate-50 text-slate-700 hover:bg-slate-100'}
            `}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
};
