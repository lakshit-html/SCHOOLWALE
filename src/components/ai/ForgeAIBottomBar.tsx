import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  Minimize2,
  Maximize2,
  Trash2,
  Copy,
  Check,
  Bot,
  User,
  Lightbulb,
  Zap,
  BookOpen,
  Brain
} from 'lucide-react';
import { geminiService, ChatMessage } from '../../services/gemini';
import { MathFormula } from '../common/MathFormula';

export const ForgeAIBottomBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content:
        '👋 Hello! I am **ForgeAI**, your 24/7 academic tutor powered by Gemini. Ask me to explain any topic from Class 9-12, derive formulas, solve numericals step-by-step, or share high-yield exam mnemonics!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (typeof messagesEndRef.current?.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    // Watchdog safety: Ensure loading is never stuck indefinitely
    const watchdog = setTimeout(() => {
      setIsLoading(false);
    }, 18000);

    try {
      const response = await geminiService.askAI(textToSend, messages);
      clearTimeout(watchdog);
      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'model',
        content: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      clearTimeout(watchdog);
    } finally {
      clearTimeout(watchdog);
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const quickPrompts = [
    { label: 'Explain simply', icon: Lightbulb, prompt: 'Explain this concept in simple, intuitive terms with everyday examples:' },
    { label: 'Step-by-step math', icon: Zap, prompt: 'Solve this numerical problem step-by-step, showing every formula and unit:' },
    { label: 'Exam PYQs & Traps', icon: BookOpen, prompt: 'What are the most common exam traps, exceptions, and high-yield PYQ patterns for:' },
    { label: 'Memory Trick', icon: Brain, prompt: 'Give me a clever mnemonic or visual trick to permanently remember:' }
  ];

  return (
    <>
      {/* Floating Trigger Button (Bottom-Right) */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-40 animate-fade-in">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-brand-600 via-teal-500 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-2xl shadow-teal-500/30 ring-2 ring-white/20 hover:scale-105 active:scale-95 transition-all group"
          >
            <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
            </div>
            <span>Ask ForgeAI Tutor</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </button>
        </div>
      )}

      {/* Floating Expandable AI Assistant Drawer */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 shadow-2xl ${
            isExpanded
              ? 'inset-2 sm:inset-6 max-w-4xl mx-auto rounded-3xl'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[440px] max-h-[85vh] rounded-3xl'
          } bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden backdrop-blur-xl`}
        >
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-brand-600 to-teal-700 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center font-black">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h4 className="text-sm font-bold flex items-center gap-1.5 leading-tight">
                  ForgeAI Mentor
                  <span className="text-[10px] font-mono bg-white/20 px-1.5 py-0.2 rounded-full font-normal">
                    Gemini Flash
                  </span>
                </h4>
                <p className="text-[10px] text-white/80">Always-on academic companion</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([messages[0]])}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                title="Clear Chat History"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden sm:block p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompt Chips */}
          <div className="p-2.5 bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {quickPrompts.map((p, i) => {
              const Icon = p.icon;
              return (
                <button
                  key={i}
                  onClick={() => {
                    setInputQuery(p.prompt + ' ');
                  }}
                  className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-brand-500 text-[11px] font-semibold whitespace-nowrap flex items-center gap-1 transition-all shadow-sm shrink-0"
                >
                  <Icon className="w-3 h-3 text-brand-500" />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 dark:bg-slate-950/50 min-h-[260px] max-h-[500px]">
            {messages.map(msg => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                      isUser
                        ? 'bg-brand-600 text-white'
                        : 'bg-teal-500/20 text-teal-600 dark:text-teal-300 border border-teal-500/30'
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div className={`max-w-[85%] group relative ${isUser ? 'items-end' : ''}`}>
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                        isUser
                          ? 'bg-brand-600 text-white rounded-tr-none'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none whitespace-pre-wrap'
                      }`}
                    >
                      <MathFormula text={msg.content} />
                    </div>

                    <div
                      className={`flex items-center gap-1.5 mt-1 text-[10px] text-slate-400 ${
                        isUser ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {!isUser && (
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:text-brand-500"
                          title="Copy Answer"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-teal-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 animate-pulse" />
                </div>
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-tl-none flex items-center gap-2 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce [animation-delay:0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce [animation-delay:0.3s]" />
                  <span className="text-xs text-slate-400 font-medium">ForgeAI is thinking...</span>
                  <button
                    type="button"
                    onClick={() => setIsLoading(false)}
                    className="ml-2 text-[10px] text-rose-500 hover:underline font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask any topic, formula derivation, or question..."
                value={inputQuery}
                onChange={e => setInputQuery(e.target.value)}
                className="flex-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isLoading}
                className="p-2.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-30 text-white rounded-xl shadow-md transition-all flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
