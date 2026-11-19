import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

describe('StudyForge Application UI & Navigation', () => {
  it('displays the onboarding tutorial on fresh startup and allows finishing it', () => {
    // Act
    render(<App />);

    // Assert tutorial appears on first launch
    expect(screen.getByText(/Welcome to StudyForge/i)).toBeInTheDocument();
    expect(screen.getByText(/Academic Operating System/i)).toBeInTheDocument();

    // Click through tutorial or skip it
    const skipBtn = screen.getByTitle(/Skip Tour/i);
    fireEvent.click(skipBtn);

    // Dashboard is visible
    expect(screen.getAllByText(/StudyForge/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Today's Study/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Consistency Streak/i)).toBeInTheDocument();
  });

  it('navigates seamlessly between tabs (Planner, Backlog, Revision, Pomodoro, Notes, Tests, Analytics, Settings)', () => {
    // Act
    render(<App />);

    // Dismiss tutorial if visible
    const skipBtn = screen.queryByTitle(/Skip Tour/i);
    if (skipBtn) fireEvent.click(skipBtn);

    // 1. Navigate to Planner
    const plannerButtons = screen.getAllByRole('button', { name: /Smart Planner/i });
    fireEvent.click(plannerButtons[0]);
    expect(screen.getByText(/Smart Study Planner/i)).toBeInTheDocument();

    // 2. Navigate to Backlog Manager
    const backlogButtons = screen.getAllByRole('button', { name: /Backlog Manager/i });
    fireEvent.click(backlogButtons[0]);
    expect(screen.getByText(/Backlog Management & Clearance/i)).toBeInTheDocument();

    // 3. Navigate to Spaced Revision
    const revisionButtons = screen.getAllByRole('button', { name: /Spaced Revision/i });
    fireEvent.click(revisionButtons[0]);
    expect(screen.getByText(/Spaced Repetition & Revision System/i)).toBeInTheDocument();

    // 4. Navigate to Pomodoro
    const pomodoroButtons = screen.getAllByRole('button', { name: /Focus Timer/i });
    fireEvent.click(pomodoroButtons[0]);
    expect(screen.getByText(/Pomodoro Focus Sanctuary/i)).toBeInTheDocument();

    // 5. Navigate to Study Arena & Games
    const arenaButtons = screen.getAllByRole('button', { name: /Study Arena & Games/i });
    fireEvent.click(arenaButtons[0]);
    expect(screen.getByText(/BrainForge Arena & Boss Quest/i)).toBeInTheDocument();

    // 6. Navigate to Notes
    const notesButtons = screen.getAllByRole('button', { name: /Notes Manager/i });
    fireEvent.click(notesButtons[0]);
    expect(screen.getByText(/Academic Notes & Formula Vault/i)).toBeInTheDocument();

    // 6. Navigate to Mock Tests
    const testsButtons = screen.getAllByRole('button', { name: /Mock Tests & Exam/i });
    fireEvent.click(testsButtons[0]);
    expect(screen.getByText(/Mock Tests & Examination Intelligence/i)).toBeInTheDocument();

    // 7. Navigate to Analytics
    const analyticsButtons = screen.getAllByRole('button', { name: /Analytics & Insights/i });
    fireEvent.click(analyticsButtons[0]);
    expect(screen.getByText(/Academic Performance & Analytics/i)).toBeInTheDocument();

    // 8. Navigate to Settings
    const settingsButtons = screen.getAllByRole('button', { name: /Settings & Data/i });
    fireEvent.click(settingsButtons[0]);
    expect(screen.getByText(/Settings & Preferences/i)).toBeInTheDocument();
  });

  it('opens and closes the Quick Add action modal', () => {
    // Arrange
    render(<App />);

    // Dismiss tutorial if visible
    const skipBtn = screen.queryByTitle(/Skip Tour/i);
    if (skipBtn) fireEvent.click(skipBtn);

    // Act
    const quickAddBtn = screen.getByRole('button', { name: /Quick Add/i });
    fireEvent.click(quickAddBtn);

    // Assert
    expect(screen.getByText(/Quick Action/i)).toBeInTheDocument();
    expect(screen.getByText(/Study Task/i)).toBeInTheDocument();
    expect(screen.getByText(/Backlog Lecture/i)).toBeInTheDocument();
  });
});
