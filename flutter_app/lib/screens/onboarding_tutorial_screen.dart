import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../theme/app_theme.dart';
import 'main_navigation_screen.dart';

class TutorialSlide {
  final String title;
  final String subtitle;
  final String badge;
  final IconData icon;
  final Color color;
  final String description;
  final List<String> highlights;

  TutorialSlide({
    required this.title,
    required this.subtitle,
    required this.badge,
    required this.icon,
    required this.color,
    required this.description,
    required this.highlights,
  });
}

class OnboardingTutorialScreen extends StatefulWidget {
  const OnboardingTutorialScreen({Key? key}) : super(key: key);

  @override
  State<OnboardingTutorialScreen> createState() => _OnboardingTutorialScreenState();
}

class _OnboardingTutorialScreenState extends State<OnboardingTutorialScreen> {
  int _currentStep = 0;

  final List<TutorialSlide> _slides = [
    TutorialSlide(
      title: 'Welcome to StudyForge',
      subtitle: 'Your Personal Academic Productivity Suite',
      badge: 'Academic Operating System',
      icon: Icons.auto_awesome,
      color: AppTheme.brandPrimary,
      description:
          'StudyForge is engineered to help students, Class 11/12 scholars, and competitive aspirants organize daily studies, eliminate backlogs, and retain concepts without burnout.',
      highlights: [
        '🎯 Set daily study hours target and build an unbreakable streak',
        '⚡ 100% offline & private — all data stays right on your device',
        '🌗 Switch effortlessly between Dark, Light, and Monochrome modes',
      ],
    ),
    TutorialSlide(
      title: 'Real-Time Dashboard',
      subtitle: 'Track Today’s Target & Weekly Momentum',
      badge: 'Executive Command Center',
      icon: Icons.dashboard_outlined,
      color: AppTheme.brandBlue,
      description:
          'The dashboard automatically calculates your completed hours, syllabus progress, pending tasks, and consistency streak using real session data.',
      highlights: [
        '⏱️ Today’s Hours: Combines verified focus sessions and completed tasks',
        '🔥 Consistency Streak: Rewards consecutive active study days',
        '📊 7-Day Output Graph: Visual comparison of daily hours vs your goal',
      ],
    ),
    TutorialSlide(
      title: 'Smart Study Planner',
      subtitle: 'Intelligent Scheduling & Target Tracking',
      badge: 'Daily & Weekly Horizon',
      icon: Icons.calendar_month_outlined,
      color: Colors.cyan,
      description:
          'Plan lectures, practice problem sheets, and assignments. Prioritizes tasks based on deadlines and exam criticality.',
      highlights: [
        '⚖️ Overload Detection: Flags days that exceed your daily capacity',
        '🪄 Auto-Schedule Button: 1-click rebalancing across upcoming days',
        '📚 Curriculum Manager: Organize chapters with difficulty & lecture counts',
      ],
    ),
    TutorialSlide(
      title: 'Backlog Clearance',
      subtitle: 'Liquidate Pending Lectures with Precision',
      badge: 'Zero-Debt Forecasting',
      icon: Icons.inventory_2_outlined,
      color: AppTheme.brandRose,
      description:
          'Never feel overwhelmed by accumulated video lectures again. Track exact duration, notes status, and homework submissions.',
      highlights: [
        '📅 Projected Zero-Backlog Date: Calculates exact date you will be caught up',
        '🎚️ Dynamic Pace Controller: Adjust hours/day to see completion timelines',
        '⚡ 1-Click Move: Instantly move any backlog lecture into today’s schedule',
      ],
    ),
    TutorialSlide(
      title: 'Spaced Repetition System',
      subtitle: 'Scientific Intervals to Defeat the Forgetting Curve',
      badge: 'Long-Term Memory Retention',
      icon: Icons.repeat,
      color: Colors.amber,
      description:
          'Based on the Ebbinghaus retention curve, topics are queued for revision across 5 calibrated cycles: 1 Day, 3 Days, 7 Days, 14 Days, and 30 Days.',
      highlights: [
        '🧠 Adaptive Confidence: Low confidence shortens interval; High expands it',
        '🚨 Overdue Indicators: Never let critical formulae slip from memory',
        '📜 Cycle History: Complete audit trail of past revision ratings',
      ],
    ),
    TutorialSlide(
      title: 'Focus Sanctuary & Notes',
      subtitle: 'Persistent Deep Timer & Formula Vault',
      badge: 'Concentration & Recall',
      icon: Icons.timer_outlined,
      color: Colors.indigoAccent,
      description:
          'A persistent Pomodoro timer that continues in the background, paired with a rich high-yield Markdown Formula Sheet vault.',
      highlights: [
        '⏲️ Presets (25m, 45m, 60m) with short/long recovery breaks',
        '🪟 Floating Mini-Timer HUD: Floats on top of all screens while you read',
        '📝 Formula sheets with subject filtering, tag search, and Whiteboard link',
      ],
    ),
    TutorialSlide(
      title: 'Mock Tests & Exam Intelligence',
      subtitle: 'Diagnose Mistakes & Track Score Trajectories',
      badge: 'Exam Simulation',
      icon: Icons.military_tech_outlined,
      color: AppTheme.brandGreen,
      description:
          'Record mock test scores, track subject-wise marks, perform root-cause mistake diagnosis, and build actionable improvement checklists.',
      highlights: [
        '📈 Score Progression Curve: Visual graph tracking percentage over time',
        '🎯 Weak Areas Tagging: Pinpoints topics that consistently cost marks',
        '🛠️ Action Plan Tracker: Enforces corrective problem-solving routines',
      ],
    ),
    TutorialSlide(
      title: 'Ready to Launch',
      subtitle: 'Your Scholar Profile is Configured!',
      badge: 'Ready to Conquer',
      icon: Icons.rocket_launch,
      color: AppTheme.brandGold,
      description:
          'All your preferences and local database vaults have been initialized. You are now ready to conquer your academic goals.',
      highlights: [
        '🔥 Day 1 study streak is active',
        '🎁 50 Welcome Forge Coins credited to your wallet',
        '💾 Database encrypted & safely stored offline on your device',
      ],
    ),
  ];

  void _finishOnboarding() {
    final appState = context.read<AppState>();
    final profile = appState.profile;
    final updated = profile.copyWith(hasCompletedOnboarding: true, isLoggedIn: true);
    appState.updateProfile(updated);

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => const MainNavigationScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    final slide = _slides[_currentStep];
    final isLast = _currentStep == _slides.length - 1;

    return Scaffold(
      backgroundColor: AppTheme.bgDark,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Top Bar: Badge, Skip Button & Counter
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: slide.color.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: slide.color.withOpacity(0.3)),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(slide.icon, color: slide.color, size: 14),
                        const SizedBox(width: 6),
                        Text(slide.badge, style: TextStyle(color: slide.color, fontSize: 11, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ),
                  TextButton(
                    onPressed: _finishOnboarding,
                    child: const Text('Skip Tour', style: TextStyle(color: Colors.white54, fontSize: 12)),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // Main Slide Card
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(22),
                  decoration: BoxDecoration(
                    color: AppTheme.cardDark,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: AppTheme.borderDark),
                  ),
                  child: SingleChildScrollView(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          width: 54,
                          height: 54,
                          decoration: BoxDecoration(
                            color: slide.color.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: slide.color.withOpacity(0.4)),
                          ),
                          child: Center(
                            child: Icon(slide.icon, color: slide.color, size: 28),
                          ),
                        ),
                        const SizedBox(height: 16),

                        Text(
                          slide.title,
                          style: const TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          slide.subtitle,
                          style: TextStyle(color: slide.color, fontSize: 13, fontWeight: FontWeight.w600),
                        ),
                        const SizedBox(height: 14),

                        Text(
                          slide.description,
                          style: const TextStyle(color: Colors.white70, fontSize: 13, height: 1.4),
                        ),
                        const SizedBox(height: 20),

                        // Feature Highlights
                        ...slide.highlights.map((h) => Padding(
                          padding: const EdgeInsets.only(bottom: 10),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Icon(Icons.check_circle, color: AppTheme.brandGreen, size: 16),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Text(h, style: const TextStyle(color: Colors.white, fontSize: 12, height: 1.3)),
                              ),
                            ],
                          ),
                        )).toList(),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // Bottom Navigation & Counter
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  if (_currentStep > 0)
                    OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.white70,
                        side: const BorderSide(color: AppTheme.borderDark),
                        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      onPressed: () => setState(() => _currentStep--),
                      child: const Text('Back'),
                    )
                  else
                    const SizedBox(width: 60),

                  // Step Indicators
                  Row(
                    children: List.generate(_slides.length, (idx) {
                      final isCurrent = idx == _currentStep;
                      return Container(
                        width: isCurrent ? 18 : 6,
                        height: 6,
                        margin: const EdgeInsets.symmetric(horizontal: 2.5),
                        decoration: BoxDecoration(
                          color: isCurrent ? AppTheme.brandPrimary : Colors.white24,
                          borderRadius: BorderRadius.circular(6),
                        ),
                      );
                    }),
                  ),

                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: isLast ? AppTheme.brandGold : AppTheme.brandPrimary,
                      foregroundColor: isLast ? Colors.black : Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                    onPressed: () {
                      if (isLast) {
                        _finishOnboarding();
                      } else {
                        setState(() => _currentStep++);
                      }
                    },
                    child: Text(
                      isLast ? 'Enter App 🚀' : 'Next',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
