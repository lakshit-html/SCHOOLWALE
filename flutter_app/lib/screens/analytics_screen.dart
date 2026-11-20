import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../theme/app_theme.dart';

class AnalyticsScreen extends StatelessWidget {
  const AnalyticsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final profile = appState.profile;
    final tasks = appState.tasks;

    final completedTasks = tasks.where((t) => t.isCompleted).length;
    final totalTasks = tasks.length;
    final taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) : 0.0;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Academic Analytics & Mastery', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Weekly Output & Goal Card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF1E1B4B), Color(0xFF312E81), Color(0xFF0F172A)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: AppTheme.brandPrimary.withOpacity(0.4)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Daily Goal Output', style: TextStyle(color: Colors.white70, fontSize: 12)),
                        const SizedBox(height: 4),
                        Text(
                          '${profile.studyHoursGoal}h / day Target',
                          style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(color: Colors.white12, borderRadius: BorderRadius.circular(12)),
                      child: Text('Level ${profile.level}', style: const TextStyle(color: AppTheme.brandGold, fontWeight: FontWeight.bold, fontSize: 12)),
                    ),
                  ],
                ),
                const SizedBox(height: 20),

                // 7-Day Visual Bars
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    _buildDayBar('Mon', 0.8),
                    _buildDayBar('Tue', 0.6),
                    _buildDayBar('Wed', 1.0),
                    _buildDayBar('Thu', 0.7),
                    _buildDayBar('Fri', 0.9),
                    _buildDayBar('Sat', 0.5),
                    _buildDayBar('Sun', 0.85, isToday: true),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Key Velocity Metrics Grid
          Row(
            children: [
              _buildMetricTile(
                title: 'Study Streak',
                value: '${profile.currentStreak} Days',
                subtitle: 'Consecutive Days Active',
                icon: Icons.local_fire_department,
                color: Colors.orange,
              ),
              const SizedBox(width: 12),
              _buildMetricTile(
                title: 'Sessions Done',
                value: '${appState.timerCompletedSessions}',
                subtitle: 'Deep Focus Intervals',
                icon: Icons.timer,
                color: AppTheme.brandBlue,
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              _buildMetricTile(
                title: 'Tasks Finished',
                value: '$completedTasks / $totalTasks',
                subtitle: '${(taskProgress * 100).toInt()}% Completion Rate',
                icon: Icons.task_alt,
                color: AppTheme.brandGreen,
              ),
              const SizedBox(width: 12),
              _buildMetricTile(
                title: 'Academic XP',
                value: '${profile.xp} XP',
                subtitle: '${profile.coins} Forge Coins',
                icon: Icons.military_tech,
                color: AppTheme.brandGold,
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Subject Syllabus Velocity
          const Text('Subject Distribution & Velocity', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
          const SizedBox(height: 12),

          _buildSubjectProgress('Physics', 0.72, AppTheme.brandBlue),
          const SizedBox(height: 10),
          _buildSubjectProgress('Chemistry', 0.65, AppTheme.brandGreen),
          const SizedBox(height: 10),
          _buildSubjectProgress('Mathematics', 0.80, AppTheme.brandPrimary),
          const SizedBox(height: 10),
          _buildSubjectProgress('Biology', 0.58, AppTheme.brandRose),
        ],
      ),
    );
  }

  Widget _buildDayBar(String label, double ratio, {bool isToday = false}) {
    return Column(
      children: [
        Container(
          width: 22,
          height: 80 * ratio,
          decoration: BoxDecoration(
            color: isToday ? AppTheme.brandPrimary : Colors.white24,
            borderRadius: BorderRadius.circular(6),
          ),
        ),
        const SizedBox(height: 6),
        Text(
          label,
          style: TextStyle(
            fontSize: 11,
            color: isToday ? AppTheme.brandPrimary : Colors.white54,
            fontWeight: isToday ? FontWeight.bold : FontWeight.normal,
          ),
        ),
      ],
    );
  }

  Widget _buildMetricTile({
    required String title,
    required String value,
    required String subtitle,
    required IconData icon,
    required Color color,
  }) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppTheme.cardDark,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppTheme.borderDark),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(height: 10),
            Text(value, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18)),
            const SizedBox(height: 2),
            Text(subtitle, style: const TextStyle(color: Colors.white54, fontSize: 10)),
          ],
        ),
      ),
    );
  }

  Widget _buildSubjectProgress(String subject, double progress, Color color) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppTheme.cardDark,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.borderDark),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(subject, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
              Text('${(progress * 100).toInt()}% Coverage', style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 12)),
            ],
          ),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: progress,
              minHeight: 6,
              backgroundColor: Colors.white12,
              valueColor: AlwaysStoppedAnimation(color),
            ),
          ),
        ],
      ),
    );
  }
}
