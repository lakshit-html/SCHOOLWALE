import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../models/study_task.dart';
import '../theme/app_theme.dart';
import '../widgets/forge_ai_bottom_sheet.dart';
import '../widgets/quick_calculator_sheet.dart';
import 'profile_screen.dart';
import 'revision_screen.dart';
import 'backlog_screen.dart';
import 'notes_screen.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({Key? key}) : super(key: key);

  void _showAddTaskDialog(BuildContext context) {
    final titleCtrl = TextEditingController();
    final durCtrl = TextEditingController(text: '45');
    String selectedSubject = 'Physics';
    TaskPriority selectedPriority = TaskPriority.medium;

    final subjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology'];

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          backgroundColor: AppTheme.cardDark,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Text('Add Study Target', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: titleCtrl,
                style: const TextStyle(color: Colors.white, fontSize: 14),
                decoration: InputDecoration(
                  hintText: 'e.g. Revise Ray Optics & Lens Maker Formula',
                  hintStyle: const TextStyle(color: Colors.white38),
                  filled: true,
                  fillColor: AppTheme.bgDark,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                ),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: DropdownButton<String>(
                      value: selectedSubject,
                      isExpanded: true,
                      dropdownColor: AppTheme.cardDark,
                      underline: const SizedBox(),
                      items: subjects.map((s) => DropdownMenuItem(value: s, child: Text(s, style: const TextStyle(color: Colors.white)))).toList(),
                      onChanged: (val) {
                        if (val != null) setDialogState(() => selectedSubject = val);
                      },
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: TextField(
                      controller: durCtrl,
                      keyboardType: TextInputType.number,
                      style: const TextStyle(color: Colors.white, fontSize: 14),
                      decoration: InputDecoration(
                        labelText: 'Minutes',
                        labelStyle: const TextStyle(color: Colors.white54),
                        filled: true,
                        fillColor: AppTheme.bgDark,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel', style: TextStyle(color: Colors.white54))),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: AppTheme.brandPrimary),
              onPressed: () {
                if (titleCtrl.text.trim().isNotEmpty) {
                  final task = StudyTask(
                    id: 'task_${DateTime.now().millisecondsSinceEpoch}',
                    title: titleCtrl.text.trim(),
                    subject: selectedSubject,
                    durationMinutes: int.tryParse(durCtrl.text) ?? 45,
                    priority: selectedPriority,
                    isCompleted: false,
                    scheduledDate: DateTime.now(),
                  );
                  context.read<AppState>().addTask(task);
                  Navigator.pop(ctx);
                }
              },
              child: const Text('Add Target', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final profile = appState.profile;
    final tasks = appState.tasks;
    final isMono = appState.isMonochromeMode;

    final completedCount = tasks.where((t) => t.isCompleted).length;
    final progress = tasks.isEmpty ? 0.0 : completedCount / tasks.length;

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              profile.name,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 17),
            ),
            Text(
              '${profile.grade} • ${profile.targetExam}',
              style: const TextStyle(fontSize: 11, color: Colors.white54),
            ),
          ],
        ),
        actions: [
          // Theme Switcher (Monochrome B&W <-> Cyber Vibrant)
          IconButton(
            icon: Icon(
              isMono ? Icons.dark_mode : Icons.contrast,
              color: isMono ? Colors.white : AppTheme.brandGold,
              size: 20,
            ),
            tooltip: isMono ? 'Switch to Cyber Vibrant' : 'Switch to Minimalist B&W',
            onPressed: () => appState.toggleMonochromeMode(),
          ),
          // Backlog Tracker
          IconButton(
            icon: const Icon(Icons.inventory_2_outlined, color: AppTheme.brandRose, size: 20),
            onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const BacklogScreen())),
            tooltip: 'Backlog Tracker',
          ),
          // Notes & Formulas
          IconButton(
            icon: const Icon(Icons.menu_book, color: AppTheme.brandBlue, size: 20),
            onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const NotesScreen())),
            tooltip: 'Formulas & Notes',
          ),
          // Calculator
          IconButton(
            icon: const Icon(Icons.calculate_outlined, color: AppTheme.brandGreen, size: 20),
            onPressed: () => QuickCalculatorSheet.show(context),
            tooltip: 'Scientific Calculator',
          ),
          // Profile Avatar
          IconButton(
            icon: Container(
              width: 30,
              height: 30,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: isMono
                      ? [Colors.white24, Colors.white12]
                      : [AppTheme.brandPrimary, AppTheme.brandBlue],
                ),
                shape: BoxShape.circle,
                border: Border.all(color: Colors.white30, width: 1.5),
              ),
              child: Center(
                child: Text(
                  profile.name.isNotEmpty ? profile.name[0].toUpperCase() : 'S',
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
                ),
              ),
            ),
            onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ProfileScreen())),
            tooltip: 'Profile & Database',
          ),
          const SizedBox(width: 4),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async => appState.notifyListeners(),
        child: ListView(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          children: [
            // Visual Hero Banner with Image Background
            ClipRRect(
              borderRadius: BorderRadius.circular(22),
              child: Stack(
                children: [
                  // High-Res Curated Study Imagery
                  Image.network(
                    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
                    height: 140,
                    width: double.infinity,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Container(
                      height: 140,
                      color: const Color(0xFF0F172A),
                    ),
                  ),
                  // Dark Gradient Scrim
                  Container(
                    height: 140,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          Colors.black.withOpacity(0.85),
                          Colors.black.withOpacity(0.55),
                        ],
                        begin: Alignment.bottomLeft,
                        end: Alignment.topRight,
                      ),
                    ),
                  ),
                  // Content
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: isMono ? Colors.white12 : AppTheme.brandPrimary.withOpacity(0.4),
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: Colors.white24),
                              ),
                              child: Text(
                                '⚡ Level ${profile.level} Scholar',
                                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white),
                              ),
                            ),
                            Row(
                              children: [
                                const Icon(Icons.local_fire_department, color: Colors.orangeAccent, size: 16),
                                const SizedBox(width: 3),
                                Text('${profile.currentStreak}d Streak', style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
                                const SizedBox(width: 10),
                                const Icon(Icons.monetization_on, color: AppTheme.brandGold, size: 16),
                                const SizedBox(width: 3),
                                Text('${profile.coins}', style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
                              ],
                            ),
                          ],
                        ),
                        const Spacer(),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text('Daily Goal Progress', style: TextStyle(color: Colors.white70, fontSize: 12)),
                            Text('${(progress * 100).toInt()}% Done', style: const TextStyle(color: AppTheme.brandGreen, fontSize: 12, fontWeight: FontWeight.bold)),
                          ],
                        ),
                        const SizedBox(height: 6),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(6),
                          child: LinearProgressIndicator(
                            value: progress,
                            minHeight: 6,
                            backgroundColor: Colors.white24,
                            valueColor: AlwaysStoppedAnimation(isMono ? Colors.white : AppTheme.brandGreen),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 18),

            // Subject Explorer Cards with Rich Photography
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Subjects & NCERT', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                TextButton(
                  onPressed: () => appState.setTabIndex(1),
                  child: const Text('View All', style: TextStyle(color: AppTheme.brandPrimary, fontSize: 12, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
            const SizedBox(height: 8),

            SizedBox(
              height: 110,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: [
                  _buildSubjectCard(
                    context,
                    'Physics',
                    'Mechanics & Optics',
                    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
                    () => appState.setTabIndex(1),
                  ),
                  _buildSubjectCard(
                    context,
                    'Chemistry',
                    'Organic & Physical',
                    'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&auto=format&fit=crop&q=80',
                    () => appState.setTabIndex(1),
                  ),
                  _buildSubjectCard(
                    context,
                    'Mathematics',
                    'Calculus & Vectors',
                    'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
                    () => appState.setTabIndex(1),
                  ),
                  _buildSubjectCard(
                    context,
                    'Biology',
                    'Genetics & Ecology',
                    'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600&auto=format&fit=crop&q=80',
                    () => appState.setTabIndex(1),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Quick Power Tools Bento Grid
            const Text('Study Power Tools', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 10),

            Row(
              children: [
                _buildToolCard(
                  title: 'Backlog Tracker',
                  subtitle: 'Clear unfinished topics',
                  icon: Icons.inventory_2_outlined,
                  color: AppTheme.brandRose,
                  onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const BacklogScreen())),
                ),
                const SizedBox(width: 10),
                _buildToolCard(
                  title: 'Formulas & Notes',
                  subtitle: 'Quick derivations vault',
                  icon: Icons.menu_book,
                  color: AppTheme.brandBlue,
                  onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const NotesScreen())),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                _buildToolCard(
                  title: 'Teacher Board',
                  subtitle: 'Multi-slide canvas',
                  icon: Icons.draw,
                  color: AppTheme.brandGold,
                  onTap: () => appState.setTabIndex(3),
                ),
                const SizedBox(width: 10),
                _buildToolCard(
                  title: 'Spaced Revision',
                  subtitle: 'Curve-calibrated review',
                  icon: Icons.repeat,
                  color: AppTheme.brandGreen,
                  onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const RevisionScreen())),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Today's Study Targets
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Today\'s Targets', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                IconButton(
                  icon: const Icon(Icons.add_circle, color: AppTheme.brandPrimary, size: 22),
                  onPressed: () => _showAddTaskDialog(context),
                  tooltip: 'Add Target',
                ),
              ],
            ),
            const SizedBox(height: 6),

            ...tasks.map((task) => Card(
              color: AppTheme.cardDark,
              margin: const EdgeInsets.only(bottom: 8),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: BorderSide(color: task.isCompleted ? AppTheme.brandGreen.withOpacity(0.4) : AppTheme.borderDark),
              ),
              child: ListTile(
                dense: true,
                contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                leading: IconButton(
                  icon: Icon(
                    task.isCompleted ? Icons.check_circle : Icons.radio_button_unchecked,
                    color: task.isCompleted ? AppTheme.brandGreen : Colors.white38,
                    size: 22,
                  ),
                  onPressed: () => appState.toggleTask(task.id),
                ),
                title: Text(
                  task.title,
                  style: TextStyle(
                    color: task.isCompleted ? Colors.white38 : Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                    decoration: task.isCompleted ? TextDecoration.lineThrough : null,
                  ),
                ),
                subtitle: Text(
                  '${task.subject} • ${task.durationMinutes} mins',
                  style: const TextStyle(color: Colors.white54, fontSize: 11),
                ),
                trailing: IconButton(
                  icon: const Icon(Icons.delete_outline, color: Colors.white24, size: 18),
                  onPressed: () => appState.deleteTask(task.id),
                ),
              ),
            )).toList(),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Widget _buildSubjectCard(BuildContext context, String title, String sub, String imgUrl, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 140,
        margin: const EdgeInsets.only(right: 12),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppTheme.borderDark),
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(16),
          child: Stack(
            children: [
              Image.network(
                imgUrl,
                width: 140,
                height: 110,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => Container(color: AppTheme.cardDark),
              ),
              Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Colors.black.withOpacity(0.85), Colors.black.withOpacity(0.3)],
                    begin: Alignment.bottomCenter,
                    end: Alignment.topCenter,
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Text(title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                    const SizedBox(height: 2),
                    Text(sub, style: const TextStyle(color: Colors.white70, fontSize: 10), maxLines: 1, overflow: TextOverflow.ellipsis),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildToolCard({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Expanded(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: AppTheme.cardDark,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppTheme.borderDark),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: color, size: 20),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                    const SizedBox(height: 2),
                    Text(subtitle, style: const TextStyle(color: Colors.white54, fontSize: 10), maxLines: 1, overflow: TextOverflow.ellipsis),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
