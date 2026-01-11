
import React, { useState, useCallback, useEffect } from 'react';
import { Calculator } from './components/Calculator';
import { HistoryPanel } from './components/HistoryPanel';
import { AiAssistant } from './components/AiAssistant';
import { CalculatorState, Calculation, Operator } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<CalculatorState>({
    currentValue: '0',
    previousValue: '',
    operator: null,
    overwrite: false,
    history: JSON.parse(localStorage.getItem('zen_calc_history') || '[]'),
  });

  const [activeTab, setActiveTab] = useState<'calc' | 'ai'>('calc');

  useEffect(() => {
    localStorage.setItem('zen_calc_history', JSON.stringify(state.history));
  }, [state.history]);

  const addToHistory = useCallback((expression: string, result: string) => {
    const newCalc: Calculation = {
      id: Math.random().toString(36).substr(2, 9),
      expression,
      result,
      timestamp: Date.now(),
    };
    setState(prev => ({
      ...prev,
      history: [newCalc, ...prev.history].slice(0, 50),
    }));
  }, []);

  const clearHistory = useCallback(() => {
    setState(prev => ({ ...prev, history: [] }));
  }, []);

  const calculate = (prev: string, curr: string, op: Operator): string => {
    const p = parseFloat(prev);
    const c = parseFloat(curr);
    if (isNaN(p) || isNaN(c)) return curr;

    let res = 0;
    switch (op) {
      case '+': res = p + c; break;
      case '-': res = p - c; break;
      case '*': res = p * c; break;
      case '/': res = c === 0 ? 0 : p / c; break;
      default: return curr;
    }
    
    // Formatting to avoid floating point precision issues
    return parseFloat(res.toFixed(10)).toString();
  };

  const handleAction = useCallback((type: string, value?: string) => {
    setState(prev => {
      switch (type) {
        case 'DIGIT':
          if (value === '.' && prev.currentValue.includes('.')) return prev;
          if (prev.currentValue === '0' && value !== '.') {
            return { ...prev, currentValue: value!, overwrite: false };
          }
          if (prev.overwrite) {
            return { ...prev, currentValue: value!, overwrite: false };
          }
          return { ...prev, currentValue: prev.currentValue + value! };

        case 'OPERATOR':
          if (prev.previousValue && prev.operator) {
            const res = calculate(prev.previousValue, prev.currentValue, prev.operator);
            return {
              ...prev,
              previousValue: res,
              currentValue: '0',
              operator: value as Operator,
              overwrite: true
            };
          }
          return {
            ...prev,
            previousValue: prev.currentValue,
            currentValue: '0',
            operator: value as Operator,
            overwrite: true
          };

        case 'EQUALS':
          if (!prev.operator || !prev.previousValue) return prev;
          const result = calculate(prev.previousValue, prev.currentValue, prev.operator);
          const expr = `${prev.previousValue} ${prev.operator} ${prev.currentValue}`;
          addToHistory(expr, result);
          return {
            ...prev,
            previousValue: '',
            currentValue: result,
            operator: null,
            overwrite: true
          };

        case 'CLEAR':
          return { ...prev, currentValue: '0', previousValue: '', operator: null, overwrite: false };

        case 'DELETE':
          if (prev.overwrite) return { ...prev, currentValue: '0', overwrite: false };
          if (prev.currentValue.length === 1) return { ...prev, currentValue: '0' };
          return { ...prev, currentValue: prev.currentValue.slice(0, -1) };

        case 'PERCENT':
          const pVal = (parseFloat(prev.currentValue) / 100).toString();
          return { ...prev, currentValue: pVal };

        case 'TOGGLE_SIGN':
          const sVal = (parseFloat(prev.currentValue) * -1).toString();
          return { ...prev, currentValue: sVal };

        default:
          return prev;
      }
    });
  }, [addToHistory]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-slate-50">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-light tracking-tight text-slate-800">Zen<span className="font-semibold">Calc</span></h1>
        <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-medium">Minimalist Intelligence</p>
      </header>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Section: History */}
        <div className="hidden lg:block lg:col-span-3 h-[600px]">
          <HistoryPanel 
            history={state.history} 
            onClear={clearHistory} 
            onSelect={(calc) => setState(prev => ({ ...prev, currentValue: calc.result, overwrite: true }))}
          />
        </div>

        {/* Center Section: Main Calculator / AI */}
        <div className="lg:col-span-6 w-full flex flex-col gap-4">
          <nav className="flex justify-center mb-2">
            <div className="bg-slate-200/50 p-1 rounded-full flex gap-1">
              <button 
                onClick={() => setActiveTab('calc')}
                className={`px-6 py-1.5 rounded-full text-sm font-medium transition-all ${activeTab === 'calc' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Calculator
              </button>
              <button 
                onClick={() => setActiveTab('ai')}
                className={`px-6 py-1.5 rounded-full text-sm font-medium transition-all ${activeTab === 'ai' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                AI Solver
              </button>
            </div>
          </nav>

          <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-white border border-slate-100 min-h-[550px]">
             {activeTab === 'calc' ? (
                <Calculator 
                  currentValue={state.currentValue} 
                  previousValue={state.previousValue} 
                  operator={state.operator}
                  onAction={handleAction} 
                />
             ) : (
                <AiAssistant />
             )}
          </div>
        </div>

        {/* Right Section: Features/Context (Optional or mobile-friendly history) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="lg:hidden">
            <HistoryPanel 
              history={state.history} 
              onClear={clearHistory} 
              onSelect={(calc) => {
                setState(prev => ({ ...prev, currentValue: calc.result, overwrite: true }));
                setActiveTab('calc');
              }}
            />
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Quick Tips
            </h3>
            <ul className="text-xs text-slate-500 space-y-2 leading-relaxed">
              <li>• Use <strong>AI Solver</strong> for complex natural language questions like tips or unit conversions.</li>
              <li>• Click any history item to bring the result back to the display.</li>
              <li>• Precision is maintained up to 10 decimal places.</li>
            </ul>
          </div>
        </div>
      </div>

      <footer className="mt-12 text-slate-400 text-xs font-light">
        &copy; 2024 ZenCalc. Built with Gemini AI.
      </footer>
    </div>
  );
};

export default App;
