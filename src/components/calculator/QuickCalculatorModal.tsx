import React, { useState, useEffect } from 'react';
import {
  X,
  History,
  Delete,
  Copy,
  Check,
  Calculator as CalcIcon
} from 'lucide-react';
import { soundEffects } from '../../services/audio';

interface QuickCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HistoryItem {
  expression: string;
  result: string;
  timestamp: string;
}

export const QuickCalculatorModal: React.FC<QuickCalculatorModalProps> = ({
  isOpen,
  onClose
}) => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [isScientific, setIsScientific] = useState(false);
  const [isRad, setIsRad] = useState(false); // Degrees vs Radians
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied] = useState(false);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (/^[0-9]$/.test(e.key)) {
        appendDigit(e.key);
      } else if (e.key === '.') {
        appendDecimal();
      } else if (['+', '-', '*', '/'].includes(e.key)) {
        const op = e.key === '*' ? '×' : e.key === '/' ? '÷' : e.key;
        appendOperator(op);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculateResult();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, display, expression]);

  if (!isOpen) return null;

  const appendDigit = (digit: string) => {
    soundEffects.playTactileClick();
    if (display === '0' || display === 'Error') {
      setDisplay(digit);
    } else {
      setDisplay(display + digit);
    }
  };

  const appendDecimal = () => {
    soundEffects.playTactileClick();
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const appendOperator = (op: string) => {
    soundEffects.playTactileClick();
    setExpression(`${display} ${op} `);
    setDisplay('0');
  };

  const clearAll = () => {
    soundEffects.playTactileClick();
    setDisplay('0');
    setExpression('');
  };

  const handleBackspace = () => {
    soundEffects.playTactileClick();
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const toggleSign = () => {
    soundEffects.playTactileClick();
    if (display !== '0') {
      if (display.startsWith('-')) {
        setDisplay(display.slice(1));
      } else {
        setDisplay('-' + display);
      }
    }
  };

  const calculateResult = () => {
    try {
      soundEffects.playCompletionBeep();
      const fullExpr = `${expression}${display}`
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**');

      // Safe evaluation for math expressions
      // eslint-disable-next-line no-new-func
      const resultValue = Function(`'use strict'; return (${fullExpr})`)();
      const formattedResult =
        typeof resultValue === 'number' && !isNaN(resultValue)
          ? parseFloat(resultValue.toFixed(8)).toString()
          : 'Error';

      const newItem: HistoryItem = {
        expression: `${expression}${display}`,
        result: formattedResult,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setHistory(prev => [newItem, ...prev.slice(0, 19)]);
      setDisplay(formattedResult);
      setExpression('');
    } catch {
      setDisplay('Error');
      setExpression('');
    }
  };

  // Scientific functions
  const applyScientific = (fn: string) => {
    soundEffects.playTactileClick();
    const val = parseFloat(display);
    if (isNaN(val)) return;

    let res = 0;
    const toRad = isRad ? 1 : Math.PI / 180;

    switch (fn) {
      case 'sin':
        res = Math.sin(val * toRad);
        break;
      case 'cos':
        res = Math.cos(val * toRad);
        break;
      case 'tan':
        res = Math.tan(val * toRad);
        break;
      case 'asin':
        res = isRad ? Math.asin(val) : (Math.asin(val) * 180) / Math.PI;
        break;
      case 'acos':
        res = isRad ? Math.acos(val) : (Math.acos(val) * 180) / Math.PI;
        break;
      case 'atan':
        res = isRad ? Math.atan(val) : (Math.atan(val) * 180) / Math.PI;
        break;
      case 'sqrt':
        res = Math.sqrt(val);
        break;
      case 'sqr':
        res = Math.pow(val, 2);
        break;
      case 'cube':
        res = Math.pow(val, 3);
        break;
      case 'ln':
        res = Math.log(val);
        break;
      case 'log10':
        res = Math.log10(val);
        break;
      case 'pi':
        res = Math.PI;
        break;
      case 'e':
        res = Math.E;
        break;
      case 'inv':
        res = 1 / val;
        break;
      case 'fact': {
        const n = Math.floor(val);
        if (n < 0 || n > 170) {
          setDisplay('Error');
          return;
        }
        let f = 1;
        for (let i = 2; i <= n; i++) f *= i;
        res = f;
        break;
      }
      default:
        res = val;
    }

    const formatted = parseFloat(res.toFixed(8)).toString();
    setDisplay(formatted);
  };

  const copyDisplay = () => {
    navigator.clipboard.writeText(display);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <CalcIcon className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Scientific Calculator
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsScientific(!isScientific)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                isScientific
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {isScientific ? 'Sci ON' : 'Standard'}
            </button>

            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                showHistory
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Calculation History"
            >
              <History className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Display Screen (Skeuomorphic LCD / OLED look) */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 relative">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-1 h-5">
            <span>{isScientific ? (isRad ? 'RAD' : 'DEG') : ''}</span>
            <span className="truncate max-w-[280px]">{expression}</span>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={copyDisplay}
              className="p-1.5 text-slate-500 hover:text-teal-400 transition-colors"
              title="Copy to Clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-teal-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <div className="text-3xl sm:text-4xl font-black font-mono text-teal-300 tracking-wider truncate text-right flex-1 ml-2">
              {display}
            </div>
          </div>
        </div>

        {/* History Overlay Drawer */}
        {showHistory ? (
          <div className="p-4 max-h-72 overflow-y-auto space-y-2 bg-slate-950/90 flex-1">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
              <span className="font-bold">Recent Calculations</span>
              <button
                onClick={() => setHistory([])}
                className="text-rose-400 hover:text-rose-300 text-[10px]"
              >
                Clear History
              </button>
            </div>
            {history.length === 0 ? (
              <p className="text-center text-xs text-slate-600 py-6">No previous calculations</p>
            ) : (
              history.map((h, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setDisplay(h.result);
                    setShowHistory(false);
                  }}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-teal-500/40 cursor-pointer text-right transition-colors"
                >
                  <div className="text-[11px] text-slate-500 font-mono">{h.expression} =</div>
                  <div className="text-sm font-bold text-teal-300 font-mono">{h.result}</div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* Keypad Grid */
          <div className="p-4 space-y-2.5">
            {/* Scientific Functions row (if toggled) */}
            {isScientific && (
              <div className="grid grid-cols-5 gap-1.5 pb-2 border-b border-slate-800/80">
                <button
                  onClick={() => setIsRad(!isRad)}
                  className="py-1.5 bg-slate-800 text-teal-300 text-[11px] font-bold rounded-lg border border-slate-700 hover:bg-slate-700"
                >
                  {isRad ? 'RAD' : 'DEG'}
                </button>
                <button
                  onClick={() => applyScientific('sin')}
                  className="py-1.5 bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 hover:bg-slate-700"
                >
                  sin
                </button>
                <button
                  onClick={() => applyScientific('cos')}
                  className="py-1.5 bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 hover:bg-slate-700"
                >
                  cos
                </button>
                <button
                  onClick={() => applyScientific('tan')}
                  className="py-1.5 bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 hover:bg-slate-700"
                >
                  tan
                </button>
                <button
                  onClick={() => applyScientific('pi')}
                  className="py-1.5 bg-slate-800 text-amber-300 text-xs font-bold rounded-lg border border-slate-700 hover:bg-slate-700"
                >
                  π
                </button>

                <button
                  onClick={() => applyScientific('sqrt')}
                  className="py-1.5 bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 hover:bg-slate-700"
                >
                  √x
                </button>
                <button
                  onClick={() => applyScientific('sqr')}
                  className="py-1.5 bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 hover:bg-slate-700"
                >
                  x²
                </button>
                <button
                  onClick={() => appendOperator('^')}
                  className="py-1.5 bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 hover:bg-slate-700"
                >
                  xʸ
                </button>
                <button
                  onClick={() => applyScientific('ln')}
                  className="py-1.5 bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 hover:bg-slate-700"
                >
                  ln
                </button>
                <button
                  onClick={() => applyScientific('log10')}
                  className="py-1.5 bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 hover:bg-slate-700"
                >
                  log
                </button>
              </div>
            )}

            {/* Main Keypad (Tactile Skeuomorphic Button Bevels) */}
            <div className="grid grid-cols-4 gap-2">
              {/* Row 1 */}
              <button
                onClick={clearAll}
                className="py-3 bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 font-black rounded-xl border border-rose-800/60 shadow-[0_3px_0_#4c0519] active:translate-y-1 active:shadow-none transition-all text-sm"
              >
                AC
              </button>
              <button
                onClick={handleBackspace}
                className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl border border-slate-700 shadow-[0_3px_0_#1e293b] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center"
              >
                <Delete className="w-4 h-4" />
              </button>
              <button
                onClick={toggleSign}
                className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl border border-slate-700 shadow-[0_3px_0_#1e293b] active:translate-y-1 active:shadow-none transition-all text-sm"
              >
                ±
              </button>
              <button
                onClick={() => appendOperator('÷')}
                className="py-3 bg-amber-600/30 hover:bg-amber-600/40 text-amber-300 font-black rounded-xl border border-amber-500/40 shadow-[0_3px_0_#78350f] active:translate-y-1 active:shadow-none transition-all text-lg"
              >
                ÷
              </button>

              {/* Row 2 */}
              <button
                onClick={() => appendDigit('7')}
                className="py-3 bg-slate-800/90 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700/80 shadow-[0_3px_0_#1e293b] active:translate-y-1 active:shadow-none transition-all text-base font-mono"
              >
                7
              </button>
              <button
                onClick={() => appendDigit('8')}
                className="py-3 bg-slate-800/90 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700/80 shadow-[0_3px_0_#1e293b] active:translate-y-1 active:shadow-none transition-all text-base font-mono"
              >
                8
              </button>
              <button
                onClick={() => appendDigit('9')}
                className="py-3 bg-slate-800/90 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700/80 shadow-[0_3px_0_#1e293b] active:translate-y-1 active:shadow-none transition-all text-base font-mono"
              >
                9
              </button>
              <button
                onClick={() => appendOperator('×')}
                className="py-3 bg-amber-600/30 hover:bg-amber-600/40 text-amber-300 font-black rounded-xl border border-amber-500/40 shadow-[0_3px_0_#78350f] active:translate-y-1 active:shadow-none transition-all text-lg"
              >
                ×
              </button>

              {/* Row 3 */}
              <button
                onClick={() => appendDigit('4')}
                className="py-3 bg-slate-800/90 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700/80 shadow-[0_3px_0_#1e293b] active:translate-y-1 active:shadow-none transition-all text-base font-mono"
              >
                4
              </button>
              <button
                onClick={() => appendDigit('5')}
                className="py-3 bg-slate-800/90 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700/80 shadow-[0_3px_0_#1e293b] active:translate-y-1 active:shadow-none transition-all text-base font-mono"
              >
                5
              </button>
              <button
                onClick={() => appendDigit('6')}
                className="py-3 bg-slate-800/90 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700/80 shadow-[0_3px_0_#1e293b] active:translate-y-1 active:shadow-none transition-all text-base font-mono"
              >
                6
              </button>
              <button
                onClick={() => appendOperator('-')}
                className="py-3 bg-amber-600/30 hover:bg-amber-600/40 text-amber-300 font-black rounded-xl border border-amber-500/40 shadow-[0_3px_0_#78350f] active:translate-y-1 active:shadow-none transition-all text-lg"
              >
                −
              </button>

              {/* Row 4 */}
              <button
                onClick={() => appendDigit('1')}
                className="py-3 bg-slate-800/90 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700/80 shadow-[0_3px_0_#1e293b] active:translate-y-1 active:shadow-none transition-all text-base font-mono"
              >
                1
              </button>
              <button
                onClick={() => appendDigit('2')}
                className="py-3 bg-slate-800/90 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700/80 shadow-[0_3px_0_#1e293b] active:translate-y-1 active:shadow-none transition-all text-base font-mono"
              >
                2
              </button>
              <button
                onClick={() => appendDigit('3')}
                className="py-3 bg-slate-800/90 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700/80 shadow-[0_3px_0_#1e293b] active:translate-y-1 active:shadow-none transition-all text-base font-mono"
              >
                3
              </button>
              <button
                onClick={() => appendOperator('+')}
                className="py-3 bg-amber-600/30 hover:bg-amber-600/40 text-amber-300 font-black rounded-xl border border-amber-500/40 shadow-[0_3px_0_#78350f] active:translate-y-1 active:shadow-none transition-all text-lg"
              >
                +
              </button>

              {/* Row 5 */}
              <button
                onClick={() => appendDigit('0')}
                className="col-span-2 py-3 bg-slate-800/90 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700/80 shadow-[0_3px_0_#1e293b] active:translate-y-1 active:shadow-none transition-all text-base font-mono"
              >
                0
              </button>
              <button
                onClick={appendDecimal}
                className="py-3 bg-slate-800/90 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700/80 shadow-[0_3px_0_#1e293b] active:translate-y-1 active:shadow-none transition-all text-base font-mono"
              >
                .
              </button>
              <button
                onClick={calculateResult}
                className="py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-xl shadow-[0_3px_0_#0f766e] active:translate-y-1 active:shadow-none transition-all text-xl"
              >
                =
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
