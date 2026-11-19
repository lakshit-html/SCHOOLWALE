import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings as SettingsIcon,
  User,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  ShieldCheck,
  Check,
  Sparkles,
  Bot,
  Key
} from 'lucide-react';
import { geminiService } from '../../services/gemini';

export const SettingsView: React.FC = () => {
  const {
    data,
    updateProfile,
    exportBackup,
    importBackup,
    resetDefaultData,
    loadDemoShowcase,
    clearAllData
  } = useApp();

  // Profile Form state
  const [name, setName] = useState(data.profile.name);
  const [email, setEmail] = useState(data.profile.email);
  const [targetExam, setTargetExam] = useState(data.profile.targetExam);
  const [grade, setGrade] = useState(data.profile.grade);
  const [dailyTargetHours, setDailyTargetHours] = useState(data.profile.dailyTargetHours);
  const [preferredSlotsStr, setPreferredSlotsStr] = useState(data.profile.preferredSlots.join(', '));

  // Confirm dialogs
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Gemini API Key state
  const [geminiKeyInput, setGeminiKeyInput] = useState(() => geminiService.getApiKey());
  const [keySavedMessage, setKeySavedMessage] = useState(false);

  const handleSaveGeminiKey = (e: React.FormEvent) => {
    e.preventDefault();
    geminiService.setApiKey(geminiKeyInput);
    setKeySavedMessage(true);
    setTimeout(() => setKeySavedMessage(false), 2500);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slots = preferredSlotsStr
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    updateProfile({
      name: name.trim(),
      email: email.trim(),
      targetExam: targetExam.trim(),
      grade: grade.trim(),
      dailyTargetHours: Number(dailyTargetHours) || 6,
      preferredSlots: slots
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        importBackup(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const isDark = data.profile.theme === 'dark';

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Top Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
          <SettingsIcon className="w-6 h-6 text-brand-500 dark:text-brand-400" />
          Settings & Preferences
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Customize your study targets, toggle themes, and manage your private offline data backups.
        </p>
      </div>

      {/* Student Profile Settings */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 rounded-2xl bg-brand-500/15 border border-brand-500/30 text-brand-600 dark:text-brand-300 flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Student Academic Profile
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalize targets and daily schedule constraints
            </p>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-400 mb-1 block">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-400 mb-1 block">
                Email (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-400 mb-1 block">
                Target Examination / Goal
              </label>
              <input
                type="text"
                value={targetExam}
                onChange={e => setTargetExam(e.target.value)}
                placeholder="e.g. JEE Advanced, NEET, CBSE Boards, UPSC"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-400 mb-1 block">
                Grade / Standard
              </label>
              <input
                type="text"
                value={grade}
                onChange={e => setGrade(e.target.value)}
                placeholder="e.g. Class 12, Dropper, Class 11"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-400 mb-1 block">
                Daily Study Target (Hours)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={18}
                  step={0.5}
                  value={dailyTargetHours}
                  onChange={e => setDailyTargetHours(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500 pr-10"
                  required
                />
                <span className="absolute right-3 top-2 text-xs text-slate-500 font-mono">hrs</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-400 mb-1 block">
                Preferred Study Slots (comma separated)
              </label>
              <input
                type="text"
                value={preferredSlotsStr}
                onChange={e => setPreferredSlotsStr(e.target.value)}
                placeholder="e.g. Morning, Evening, Night"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm rounded-xl shadow-md shadow-brand-600/20 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Save Profile Preferences
            </button>
          </div>
        </form>
      </div>

      {/* Interface Preferences: Dark and Light Mode */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-200 dark:border-slate-800">
          Application Appearance & Audio
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDark ? (
                <Moon className="w-5 h-5 text-indigo-400" />
              ) : (
                <Sun className="w-5 h-5 text-amber-500" />
              )}
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">Theme Mode</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                  Currently {data.profile.theme} mode
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                updateProfile({ theme: isDark ? 'light' : 'dark' })
              }
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
            >
              Switch to {isDark ? 'Light' : 'Dark'}
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {data.profile.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-brand-500" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-400" />
              )}
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                  Audio Chimes
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {data.profile.soundEnabled ? 'Synthesized chimes enabled' : 'Muted'}
                </p>
              </div>
            </div>

            <button
              onClick={() => updateProfile({ soundEnabled: !data.profile.soundEnabled })}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
            >
              {data.profile.soundEnabled ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>
      </div>

      {/* Backup, Export & Reset */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-200 dark:border-slate-800">
          Data Portability & State Management
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Export JSON */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-200 mb-1">
                <Download className="w-4 h-4 text-brand-500" />
                Export Full Backup (JSON)
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Download your complete academic database including tasks, subjects, backlogs, notes and tests.
              </p>
            </div>
            <button
              onClick={exportBackup}
              className="w-full py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download JSON Backup
            </button>
          </div>

          {/* Import JSON */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-200 mb-1">
                <Upload className="w-4 h-4 text-cyan-500" />
                Restore From Backup (JSON)
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Restore your previous StudyForge data from a saved JSON file without data loss.
              </p>
            </div>
            <label className="w-full py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5" /> Select Backup File
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* ForgeAI Gemini API Key Configuration */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 space-y-3">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-brand-500" />
            <h4 className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
              ForgeAI Student Tutor (Gemini API)
            </h4>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Enter your Google Gemini API key to enable live AI question answering, formula explanations, and numerical problem solving. Your key is stored securely in your browser&apos;s localStorage and is never shared.
          </p>

          <form onSubmit={handleSaveGeminiKey} className="space-y-3 max-w-xl">
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                value={geminiKeyInput}
                onChange={e => setGeminiKeyInput(e.target.value)}
                placeholder="AIzaSy... or AQ.Ab8..."
                className="w-full pl-9 pr-24 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-brand-500 font-mono text-slate-800 dark:text-slate-200"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
              >
                {keySavedMessage ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-300" /> Saved!
                  </>
                ) : (
                  'Save Key'
                )}
              </button>
            </div>
            {keySavedMessage && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <Check className="w-3 h-3" /> API key updated successfully! ForgeAI is ready.
              </p>
            )}
          </form>
        </div>

        {/* State Presets */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 space-y-3">
          <h4 className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
            Data State Presets
          </h4>

          <div className="flex flex-wrap items-center gap-3">
            {/* Load Demo Showcase */}
            <button
              onClick={loadDemoShowcase}
              className="px-4 py-2 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 text-brand-700 dark:text-brand-300 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-500" /> Load Demo Preview Data
            </button>

            {/* Reset to fresh starter */}
            {showResetConfirm ? (
              <div className="flex items-center gap-2 p-2 bg-amber-500/10 border border-amber-500/40 rounded-xl">
                <span className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                  Reset to clean fresh state?
                </span>
                <button
                  onClick={() => {
                    resetDefaultData();
                    setShowResetConfirm(false);
                  }}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg"
                >
                  Yes, Reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-2 py-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-500" /> Start Clean & Fresh
              </button>
            )}

            {/* Clear all */}
            {showClearConfirm ? (
              <div className="flex items-center gap-2 p-2 bg-rose-500/10 border border-rose-500/40 rounded-xl">
                <span className="text-xs text-rose-700 dark:text-rose-300 font-medium">
                  Wipe all stored data?
                </span>
                <button
                  onClick={() => {
                    clearAllData();
                    setShowClearConfirm(false);
                  }}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg"
                >
                  Yes, Wipe
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-2 py-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Wipe Everything
              </button>
            )}
          </div>
        </div>

        {/* Local privacy notice */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
          <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
          <p>
            StudyForge operates 100% locally on your computer with offline persistence. No data is
            transmitted to external servers.
          </p>
        </div>
      </div>
    </div>
  );
};
