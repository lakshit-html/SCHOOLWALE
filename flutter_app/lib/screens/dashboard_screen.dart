import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../models/study_task.dart';
import '../theme/app_theme.dart';
import '../widgets/forge_ai_bottom_sheet.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final profile = appState.profile;
    final tasks = appState.tasks;

    final completedCount = tasks.where((t) => t.isCompleted).length;
    final progress = tasks.isEmpty ? 0.0 : completedCount / tasks.length;

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Welcome, ${profile.name}',
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
            Text(
              '${profile.grade} • ${profile.targetExam}',
              style: const TextStyle(fontSize: 12, color: Colors.white54),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: AppTheme.brandPrimary.withOpacity(0.2),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.auto_awesome, color: AppTheme.brandGold, size: 18),
            ),
            onPressed: () => ForgeAIBottomSheet.show(context),
            tooltip: 'Ask ForgeAI Tutor',
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async => context.read<AppState>().notifyListeners(),
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Gamification XP & Streak Banner
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF065F46), Color(0xFF0D9488), Color(0xFF0369A1)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: AppTheme.brandPrimary.withOpacity(0.3),
                    blurRadius: 16,
                    offset: const Offset(0, 6),
                  )
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          '⚡ Level ${profile.level} Scholar',
                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white),
                        ),
                      ),
                      Row(
                        children: [
                          const Icon(Icons.local_fire_department, color: Colors.orangeAccent, size: 18),
                          const SizedBox(width: 4),
                          Text(
                            '${profile.currentStreak} Day Streak',
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white),
                          ),
                          const SizedBox(width: 12),
                          const Icon(Icons.monetization_on, color: AppTheme.brandGold, size: 18),
                          const SizedBox(width: 4),
                          Text(
                            '${profile.coins}',
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white),
                          ),
                        ],
                      )
                    ],
                  ),
                  const SizedBox(height: 14),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Total Academic XP',
                        style: TextStyle(color: Colors.white70, fontSize: 13),
                      ),
                      Text(
                        '${profile.xp} / ${(profile.level * 500)} XP',
                        style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 13),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: LinearProgressIndicator(
                      value: (profile.xp % 500) / 500,
                      minHeight: 8,
                      backgroundColor: Colors.black26,
                      valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.brandGold),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Quick Launcher Grid
            const Text(
              'Academic Tools',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
            ),
            const SizedBox(height: 12),
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              childAspectRatio: 1.4,
              children: [
                _buildActionCard(
                  title: 'NCERT Library',
                  subtitle: 'Official Books & PDFs',
                  icon: Icons.menu_book,
                  gradient: const [Color(0xFF047857), Color(0xFF0F766E)],
                  onTap: () => appState.setTabIndex(1),
                ),
                _buildActionCard(
                  title: 'Quiz Arena',
                  subtitle: 'Timed Boss Battle',
                  icon: Icons.sports_esports,
                  gradient: const [Color(0xFF7C3AED), Color(0xFF4F46E5)],
                  onTap: () => appState.setTabIndex(2),
                ),
                _buildActionCard(
                  title: 'Teacher Board',
                  subtitle: 'Blackboard & Math',
                  icon: Icons.draw,
                  gradient: const [Color(0xFFB45309), Color(0xFFD97706)],
                  onTap: () => appState.setTabIndex(3),
                ),
                _buildActionCard(
                  title: 'Focus Timer',
                  subtitle: 'Pomodoro 25/5 min',
                  icon: Icons.timer,
                  gradient: const [Color(0xFFBE123C), Color(0xFFE11D48)],
                  onTap: () => appState.setTabIndex(4),
                ),
              ],
            ),

            const SizedBox(height: 24),

            // Daily Study Checklist
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Today\'s Study Plan',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                    ),
                    Text(
                      '$completedCount of ${tasks.length} tasks completed (${(progress * 100).toInt()}%)',
                      style: const TextStyle(fontSize: 12, color: Colors.white54),
                    ),
                  ],
                ),
                TextButton.icon(
                  onPressed: () => _showAddTaskDialog(context),
                  icon: const Icon(Icons.add, size: 16, color: AppTheme.brandAccent),
                  label: const Text('Add Task', style: TextStyle(color: AppTheme.brandAccent, fontSize: 13)),
                ),
              ],
            ),
            const SizedBox(height: 8),

            if (tasks.isEmpty)
              Container(
                padding: const EdgeInsets.all(24),
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: AppTheme.cardDark,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppTheme.borderDark),
                ),
                child: const Text('No tasks planned for today! Tap "Add Task" to create one.', style: TextStyle(color: Colors.white54, fontSize: 13)),
              )
            else
              ...tasks.map((task) => Container(
                margin: const EdgeInsets.only(bottom: 8),
                decoration: BoxDecoration(
                  color: AppTheme.cardDark,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: task.isCompleted ? AppTheme.brandPrimary.withOpacity(0.5) : AppTheme.borderDark,
                  ),
                ),
                child: ListTile(
                  contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 2),
                  leading: Checkbox(
                    value: task.isCompleted,
                    activeColor: AppTheme.brandPrimary,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                    onChanged: (_) => appState.toggleTask(task.id),
                  ),
                  title: Text(
                    task.title,
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      decoration: task.isCompleted ? TextDecoration.lineThrough : null,
                      color: task.isCompleted ? Colors.white38 : Colors.white,
                    ),
                  ),
                  subtitle: Text(
                    '${task.subject} • ${task.durationMinutes} min',
                    style: const TextStyle(fontSize: 11, color: Colors.white54),
                  ),
                  trailing: IconButton(
                    icon: const Icon(Icons.delete_outline, size: 18, color: Colors.white38),
                    onPressed: () => appState.deleteTask(task.id),
                  ),
                ),
              )),
          ],
        ),
      ),
    );
  }

  Widget _buildActionCard({
    required String title,
    required String subtitle,
    required IconData icon,
    required List<Color> gradient,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          gradient: LinearGradient(colors: gradient, begin: Alignment.topLeft, end: Alignment.bottomRight),
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(color: gradient.first.withOpacity(0.3), blurRadius: 10, offset: const Offset(0, 4)),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Icon(icon, color: Colors.white, size: 26),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.white)),
                Text(subtitle, style: const TextStyle(fontSize: 11, color: Colors.white70)),
              ],
            )
          ],
        ),
      ),
    );
  }

  void _showAddTaskDialog(BuildContext context) {
    final titleCtrl = TextEditingController();
    String selectedSubject = 'Physics';
    int duration = 45;

    showDialog(
      context: context,
      builder: (dialogCtx) => StatefulBuilder(
        builder: (ctx, setDialogState) => AlertDialog(
          backgroundColor: AppTheme.cardDark,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20), side: const BorderSide(color: AppTheme.borderDark)),
          title: const Text('Add Study Task', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: titleCtrl,
                style: const TextStyle(color: Colors.white, fontSize: 13),
                decoration: const InputDecoration(
                  hintText: 'e.g. Practice Ray Optics derivations',
                  hintStyle: TextStyle(color: Colors.white38, fontSize: 13),
                ),
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                value: selectedSubject,
                dropdownColor: AppTheme.cardDark,
                style: const TextStyle(color: Colors.white, fontSize: 13),
                decoration: const InputDecoration(labelText: 'Subject'),
                items: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Science']
                    .map((s) => DropdownMenuItem(value: s, child: Text(s)))
                    .toList(),
                onChanged: (val) {
                  if (val != null) setDialogState(() => selectedSubject = val);
                },
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(dialogCtx),
              child: const Text('Cancel', style: TextStyle(color: Colors.white54)),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: AppTheme.brandPrimary),
              onPressed: () {
                if (titleCtrl.text.trim().isNotEmpty) {
                  context.read<AppState>().addTask(StudyTask(
                    id: 'task_${DateTime.now().millisecondsSinceEpoch}',
                    title: titleCtrl.text.trim(),
                    subject: selectedSubject,
                    durationMinutes: duration,
                    scheduledDate: DateTime.now(),
                  ));
                  Navigator.pop(dialogCtx);
                }
              },
              child: const Text('Add Task', style: TextStyle(color: Colors.white)),
            )
          ],
        ),
      ),
    );
  }
}
