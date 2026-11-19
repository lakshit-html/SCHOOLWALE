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
    expect(screen.getAllByText(/BrainForge Speed Recall Arena/i).length).toBeGreaterThan(0);

    // 6. Navigate to Smart Whiteboard
    const whiteboardButtons = screen.getAllByRole('button', { name: /Smart Whiteboard/i });
    fireEvent.click(whiteboardButtons[0]);
    expect(screen.getByText(/StudyForge Smart Teacher Board/i)).toBeInTheDocument();

    // 7. Navigate to Notes
    const notesButtons = screen.getAllByRole('button', { name: /Notes Manager/i });
    fireEvent.click(notesButtons[0]);
    expect(screen.getByText(/Lecture Notes & Document Vault/i)).toBeInTheDocument();

    // 8. Navigate to Mock Tests
    const testsButtons = screen.getAllByRole('button', { name: /Mock Tests & Exam/i });
    fireEvent.click(testsButtons[0]);
    expect(screen.getByText(/Mock Tests & Examination Intelligence/i)).toBeInTheDocument();

    // 9. Navigate to Analytics
    const analyticsButtons = screen.getAllByRole('button', { name: /Analytics & Insights/i });
    fireEvent.click(analyticsButtons[0]);
    expect(screen.getByText(/Academic Performance & Analytics/i)).toBeInTheDocument();

    // 10. Navigate to Settings
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

  it('opens and closes the Scientific Calculator modal and performs calculation', () => {
    // Arrange
    render(<App />);

    // Dismiss tutorial if visible
    const skipBtn = screen.queryByTitle(/Skip Tour/i);
    if (skipBtn) fireEvent.click(skipBtn);

    // Open calculator
    const calcBtn = screen.getByLabelText(/Open Calculator/i);
    fireEvent.click(calcBtn);

    // Assert calculator opened
    expect(screen.getByText(/Scientific Calculator/i)).toBeInTheDocument();

    // Click 7, +, 8, =
    const btn7 = screen.getByRole('button', { name: '7' });
    const btnPlus = screen.getByRole('button', { name: '+' });
    const btn8 = screen.getByRole('button', { name: '8' });
    const btnEquals = screen.getByRole('button', { name: '=' });

    fireEvent.click(btn7);
    fireEvent.click(btnPlus);
    fireEvent.click(btn8);
    fireEvent.click(btnEquals);

    // Result should be 15
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('opens ForgeAI academic tutor drawer from the bottom button', () => {
    // Arrange
    render(<App />);

    // Dismiss tutorial if visible
    const skipBtn = screen.queryByTitle(/Skip Tour/i);
    if (skipBtn) fireEvent.click(skipBtn);

    // Open AI assistant
    const aiTriggerBtn = screen.getByRole('button', { name: /Ask ForgeAI Tutor/i });
    fireEvent.click(aiTriggerBtn);

    // Assert drawer is open
    expect(screen.getByText(/ForgeAI Mentor/i)).toBeInTheDocument();
    expect(screen.getByText(/Gemini Flash/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ask any topic, formula derivation/i)).toBeInTheDocument();
  });
});
