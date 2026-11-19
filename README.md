# StudyForge — AI-Powered Academic Productivity Platform

> A professional-grade, offline-first student productivity suite designed to organize academic schedules, systematically eliminate backlogs, automate spaced revision intervals, and supercharge focus.

---

## 🌟 Key Capabilities

### 1. 🎯 Dynamic Student Profile & Goals
- Customizable target examinations (e.g. JEE Advanced, NEET, CBSE Boards, UPSC, etc.)
- Daily study availability target hours (with overload protection)
- Preferred study slots (Morning, Evening, Night)
- Dynamic consistency streak counter
- Dark and Light themes with persistent preference storage
- Native Web Audio sound effect toggles (pleasant synthesized completion chimes and focus alarms)

### 2. 📊 Executive Academic Dashboard
- Real-time today's study target progress bar
- Completed study hours (derived from actual focus sessions and task executions)
- Real-time syllabus covered percentage calculated across all curriculum chapters
- Real-time backlog hours count
- 7-Day productivity visual bar chart comparing daily output against target
- Spaced revision queue with overdue alert indicators
- High-priority backlog quick-action cards

### 3. 🗓️ Smart Study Planner
- **Multi-day scheduling**: View schedule for Today, Tomorrow, and upcoming days
- **Urgency scoring algorithm**:
  $$\text{Score} = (\text{PriorityWeight} \times 1.2 + \text{DueScore}) \times \text{TypeMultiplier}$$
  Overdue tasks, critical items, and spaced revisions automatically take precedence.
- **Smart Auto-Schedule**: 1-click rebalancing that distributes tasks across available days to prevent student burnout (>100% capacity)
- Curriculum manager: Create subjects with custom accent colors, target score percentages, and chapters with difficulty & priority ratings

### 4. ⏳ Backlog Management & Clearance
- Log missed lectures with chapter title, lecture number, duration, notes status, and assignment status
- **Dynamic Clearance Velocity Forecast**:
  - Live clearance rate controller (adjust from 0.5h to 4h/day)
  - Real-time projected Zero-Backlog Clearance Date calculation
  - Status filters (Pending, Cleared, All) and Priority filters
  - 1-click conversion of backlog lecture into today's planner schedule

### 5. 🔁 Spaced Repetition Revision System
- Scientifically calibrated interval progression based on the Ebbinghaus forgetting curve:
  - **Cycle 1**: Day 1
  - **Cycle 2**: Day 3
  - **Cycle 3**: Day 7
  - **Cycle 4**: Day 14
  - **Cycle 5**: Day 30
- **Adaptive Confidence Rating**:
  - *Low Confidence*: Shortens the next interval to reinforce weak recall
  - *Medium Confidence*: Follows the standard spacing interval
  - *High Confidence*: Expands interval to maximize long-term retention
- Complete cycle history logs showing dates and confidence ratings

### 6. ⏱️ Pomodoro Focus Sanctuary
- Fully functional countdown focus timer with custom presets (25m, 45m, 50m, 60m)
- Short break (5m) and long break (15m) recovery cycles
- Direct linkage to subjects and tasks
- Synthesized Web Audio API completion alarm (no external audio assets needed, 100% offline)
- Visual SVG circular progress ring
- Post-session reflection ratings (*Flow State*, *Productive*, *Distracted*)
- Daily focus session history log

### 7. 📖 Notes & Formula Vault
- Organize formula sheets, reaction mechanisms, and high-yield notes by subject and chapter
- Search by keyword, title, or tag
- Pin important notes to the top
- Full Markdown support for formatted bullet points, headings, and equations
- Instant auto-save

### 8. 🏆 Mock Test & Exam Tracker
- Record full and part-syllabus mock tests
- Automatic percentage calculations
- Subject-wise score breakdown (Physics, Chemistry, Maths, etc.)
- Mistakes diagnosis and root-cause analysis
- Weak areas tagging
- Action plan & corrective strategy tracking
- Visual score progression trend chart

### 9. 📈 Advanced Analytics & Insights
- Daily study hours vs target chart (last 7 days)
- Weekly productivity breakdown
- Subject time allocation and curriculum coverage bars
- Backlog reduction velocity
- Spaced revision compliance rate
- Mock test score trajectories (Improving, Stable, Declining)

### 10. 🔒 Privacy & Data Portability
- **100% Offline & Private**: Zero external network tracking or third-party servers
- **Full JSON Backup Export**: One-click download of the complete database
- **JSON Backup Restore**: Seamlessly import previous backups
- **One-click Sample Data Reset**: Instant demo data for exploring features
- **Secure Data Wipe**: Option to start with a blank state

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript 5.7
- **Bundler & Tooling**: Vite 6.1
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Audio Synthesis**: Native Web Audio API (`SoundEffectService`)
- **Particle FX**: Lightweight HTML5 Canvas particle generator
- **Testing**: Vitest 3.0 + React Testing Library (17 automated tests, 100% passing)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm

### 2. Launch Development Server
```powershell
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Run Automated Tests
```powershell
npm run test
```
Executes all 17 unit and component tests covering the scheduler, analytics engine, storage layer, and tab navigation.

### 4. Build for Production
```powershell
npm run build
```
Generates optimized, production-ready static assets in the `dist/` directory.

---

## 📁 Project Structure

```text
c:\Users\Suresh\Desktop\SCHOOLWALE\
├── src\
│   ├── components\
│   │   ├── analytics\       # AnalyticsView & charts
│   │   ├── backlog\         # BacklogView & BacklogModal
│   │   ├── dashboard\       # DashboardView & KPI cards
│   │   ├── layout\          # Header, Sidebar, Toast, QuickAdd
│   │   ├── notes\           # NotesView & markdown editor
│   │   ├── planner\         # PlannerView, TaskModal, SubjectChapterModal
│   │   ├── revision\        # RevisionView & RevisionModal
│   │   ├── settings\        # SettingsView & backup management
│   │   ├── tests\           # MockTestsView & MockTestModal
│   │   └── timer\           # PomodoroView & reflection modal
│   ├── context\
│   │   └── AppContext.tsx   # Centralized reactive state & actions
│   ├── services\
│   │   ├── analytics.ts     # Calculations, velocity & trend metrics
│   │   ├── audio.ts         # Web Audio API synthesized chimes
│   │   ├── scheduler.ts     # Urgency score & auto-balance algorithm
│   │   └── storage.ts       # LocalStorage schema & backup operations
│   ├── test\
│   │   ├── App.test.tsx     # Full UI & navigation integration tests
│   │   ├── analytics.test.ts# Analytics unit tests
│   │   ├── scheduler.test.ts# Urgency & scheduler tests
│   │   ├── setup.ts         # Test environment setup
│   │   └── storage.test.ts  # Persistence & backup tests
│   ├── types\
│   │   └── index.ts         # TypeScript data contracts & schemas
│   ├── utils\
│   │   └── confetti.ts      # Zero-dependency canvas confetti
│   ├── App.tsx              # Root component wrapped in provider
│   ├── AppContent.tsx       # Main router & layout shell
│   ├── index.css            # Tailwind directives & dark/light styles
│   └── main.tsx             # Application bootstrap
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

## 🔒 Security & Code Standards

- **Strict Immutability**: All state mutations use pure functional transformations.
- **Zero Secrets / Zero Paid APIs**: Operates fully client-side on local machine.
- **Input Validation**: Schema constraints on dates, durations, scores, and JSON imports.
- **Error Boundaries**: Graceful fallback states for all views.
