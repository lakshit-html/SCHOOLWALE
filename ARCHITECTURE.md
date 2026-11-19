# StudyForge — Technical Architecture & Engineering Documentation

## 1. System Overview
**StudyForge** is an offline-first academic productivity platform built with React 19, TypeScript 5.7, and Vite 6.1. The system architecture is designed around high cohesion, strict immutability, zero external paid dependencies, and local persistence.

---

## 2. Core Architecture & Component Hierarchy

```
                           +------------------------+
                           |       index.html       |
                           +-----------+------------+
                                       |
                           +-----------v------------+
                           |        main.tsx        |
                           +-----------+------------+
                                       |
                           +-----------v------------+
                           |        App.tsx         |
                           |     (AppProvider)      |
                           +-----------+------------+
                                       |
                           +-----------v------------+
                           |     AppContent.tsx     |
                           +-----+------------+-----+
                                 |            |
                 +---------------+            +---------------+
                 |                                            |
        +--------v-------+                           +--------v-------+
        |   Header.tsx   |                           |  Sidebar.tsx   |
        +----------------+                           +----------------+
                 |                                            |
                 +---------------------+----------------------+
                                       |
                +----------------------v----------------------+
                |             Active View Router              |
                +----------------------+----------------------+
                                       |
    +---------------+---------------+--+------------+----------------+
    |               |               |               |                |
+---v----+     +----v---+      +----v---+      +----v---+       +----v-----+
|Dashboard|    | Planner|      | Backlog|      |Revision|       | Pomodoro |
+--------+     +--------+      +--------+      +--------+       +----------+
    |               |               |               |                |
+---v----+     +----v---+      +----v---+      +----+---+       +----+-----+
| Notes  |     | Tests  |      |Analytics|     |Settings|       | QuickAdd |
+--------+     +--------+      +---------+     +--------+       +----------+
```

---

## 3. Data Flow & State Management

The application utilizes React Context with strict functional state transitions in `src/context/AppContext.tsx`.

### Immutability Contract:
- Every state mutation returns a shallow/deep copy using object spread (`{ ...prev, items: [...] }`).
- In-place mutation of arrays or objects is strictly forbidden.
- When an entity is updated, new identity guarantees reactive re-renders across dependent components (e.g., updating a task triggers auto-recalculation of streak, daily hours, and weekly productivity charts).

### Persistence Layer (`src/services/storage.ts`):
- Persistent storage operates via in-browser `localStorage` with fallback to typed seed defaults.
- Schema verification guarantees backward compatibility if schema keys expand.
- Data export & import produces formatted JSON backups (`StudyForge-Backup-YYYY-MM-DD.json`).

---

## 4. Algorithmic Engines

### A. Urgency Scoring & Smart Scheduling (`src/services/scheduler.ts`)
The scheduling algorithm arranges pending tasks across available study days according to daily capacity limits:

$$\text{UrgencyScore} = (\text{PriorityWeight} \times 1.2 + \text{DueScore}) \times \text{TypeMultiplier}$$

Where:
- $\text{PriorityWeight}$: Critical = 100, High = 70, Medium = 40, Low = 15
- $\text{DueScore}$:
  - If $\text{DaysOverdue} > 0$: $150 + \text{DaysOverdue} \times 20$
  - If due today: $100$
  - If due tomorrow: $70$
  - If due within 3 days: $40$
- $\text{TypeMultiplier}$: Revision = 1.25, Lecture = 1.15, Practice/Assignment = 1.0

#### Burnout Prevention:
- Tasks are placed sequentially in the earliest available day where:
  $$\text{AllocatedMinutes} + \text{TaskMinutes} \le \text{DailyTargetMinutes}$$
- If all days in the horizon are full, tasks are placed in the least-loaded day and flagged as overloaded (`capacityUtilization > 100%`).

### B. Spaced Repetition Engine (`src/services/analytics.ts` & `src/components/revision/`)
Structured on the Ebbinghaus retention curve:
- **Cycle 1**: 1 Day
- **Cycle 2**: 3 Days
- **Cycle 3**: 7 Days
- **Cycle 4**: 14 Days
- **Cycle 5**: 30 Days

#### Adaptive Confidence Scaling:
- **Low Confidence**: $\text{NextInterval} = \max(1, \lfloor \text{Interval} \times 0.5 \rfloor)$
- **Medium Confidence**: Standard next interval
- **High Confidence**: $\text{NextInterval} = \lfloor \text{Interval} \times 1.3 \rfloor$

### C. Backlog Clearance Velocity Forecast:
$$\text{EstimatedClearanceDays} = \left\lceil \frac{\text{TotalPendingHours}}{\text{DailyClearancePace}} \right\rceil$$
$$\text{ProjectedDate} = \text{CurrentDate} + \text{EstimatedClearanceDays}$$

---

## 5. Offline Media & Hardware Integration

1. **Audio Synthesis (`src/services/audio.ts`)**:
   - Implements Web Audio API `AudioContext` with zero external audio assets (`.mp3` or `.wav`).
   - Generates two-tone bell chimes (D5 to A5 ramp) on task/revision completion.
   - Generates three-note ascending arpeggio (C5, E5, G5) on Pomodoro completion.

2. **Canvas Particle System (`src/utils/confetti.ts`)**:
   - Zero-dependency HTML5 `<canvas>` simulation with 90 particle vectors, gravity acceleration ($g = 0.35$), angular rotation, and alpha fade out.

---

## 6. Test Suite & Verification Matrix

All 17 automated unit and component tests pass via Vitest:
- `src/test/scheduler.test.ts`: Urgency ranking, overdue priority weighting, load balancing, capacity overload detection.
- `src/test/analytics.test.ts`: KPI calculations, backlog forecast precision, revision compliance rates, mock test trajectories.
- `src/test/storage.test.ts`: Default seeding, serialization, JSON schema validation, factory cloning, reset confirmation.
- `src/test/App.test.tsx`: Component mounting, header KPI badges, multi-tab routing, Quick Add modal interaction.
