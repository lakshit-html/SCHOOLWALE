import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { NotificationToast } from './components/layout/NotificationToast';
import { QuickAddModal } from './components/layout/QuickAddModal';

import { DashboardView } from './components/dashboard/DashboardView';
import { PlannerView } from './components/planner/PlannerView';
import { BacklogView } from './components/backlog/BacklogView';
import { RevisionView } from './components/revision/RevisionView';
import { PomodoroView } from './components/timer/PomodoroView';
import { NotesView } from './components/notes/NotesView';
import { MockTestsView } from './components/tests/MockTestsView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';

export const AppContent: React.FC = () => {
  const { activeTab } = useApp();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Sidebar (Desktop fixed & Mobile drawer) */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        <Header
          onOpenQuickAdd={() => setIsQuickAddOpen(true)}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {activeTab === 'dashboard' && (
            <DashboardView onOpenQuickAdd={() => setIsQuickAddOpen(true)} />
          )}
          {activeTab === 'planner' && <PlannerView />}
          {activeTab === 'backlog' && <BacklogView />}
          {activeTab === 'revision' && <RevisionView />}
          {activeTab === 'pomodoro' && <PomodoroView />}
          {activeTab === 'notes' && <NotesView />}
          {activeTab === 'tests' && <MockTestsView />}
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Global Modals & Toasts */}
      <NotificationToast />
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />
    </div>
  );
};
