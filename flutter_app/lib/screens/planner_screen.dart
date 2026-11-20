import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../models/study_task.dart';
import '../theme/app_theme.dart';

class PlannerScreen extends StatefulWidget {
  const PlannerScreen({Key? key}) : super(key: key);

  @override
  State<PlannerScreen> createState() => _PlannerScreenState();
}

class _PlannerScreenState extends State<PlannerScreen> {
  String _filter = 'All';

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
          title: const Text('Schedule Study Task', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: titleCtrl,
                style: const TextStyle(color: Colors.white, fontSize: 14),
                decoration: InputDecoration(
                  hintText: 'e.g. Solve Ray Optics In-Text Numericals',
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
                        labelText: 'Duration (m)',
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
              child: const Text('Add to Schedule', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final tasks = appState.tasks;

    final filtered = tasks.where((t) {
      if (_filter == 'Pending') return !t.isCompleted;
      if (_filter == 'Completed') return t.isCompleted;
      return true;
    }).toList();

    final totalMinutes = tasks.fold<int>(0, (acc, t) => acc + t.durationMinutes);
    final completedMinutes = tasks.where((t) => t.isCompleted).fold<int>(0, (acc, t) => acc + t.durationMinutes);
    final progress = totalMinutes > 0 ? (completedMinutes / totalMinutes) : 0.0;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Smart Daily Planner', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_circle, color: AppTheme.brandPrimary),
            tooltip: 'Add Task',
            onPressed: () => _showAddTaskDialog(context),
          ),
        ],
      ),
      body: Column(
        children: [
          // Daily Capacity & Progress Card
          Container(
            padding: const EdgeInsets.all(16),
            margin: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.cardDark,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppTheme.borderDark),
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Today\'s Planned Study', style: TextStyle(color: Colors.white54, fontSize: 12)),
                        const SizedBox(height: 4),
                        Text(
                          '${(completedMinutes / 60).toStringAsFixed(1)} / ${(totalMinutes / 60).toStringAsFixed(1)} Hours',
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18),
                        ),
                      ],
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        color: AppTheme.brandPrimary.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text('${(progress * 100).toInt()}% Done', style: const TextStyle(color: AppTheme.brandPrimary, fontWeight: FontWeight.bold, fontSize: 12)),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                ClipRRect(
                  borderRadius: BorderRadius.circular(6),
                  child: LinearProgressIndicator(
                    value: progress,
                    minHeight: 6,
                    backgroundColor: Colors.white12,
                    valueColor: const AlwaysStoppedAnimation(AppTheme.brandPrimary),
                  ),
                ),
              ],
            ),
          ),

          // Filter Chips
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: ['All', 'Pending', 'Completed'].map((f) {
                final isSel = _filter == f;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ChoiceChip(
                    label: Text(f),
                    selected: isSel,
                    selectedColor: AppTheme.brandPrimary,
                    backgroundColor: AppTheme.cardDark,
                    labelStyle: TextStyle(
                      color: isSel ? Colors.white : Colors.white60,
                      fontWeight: isSel ? FontWeight.bold : FontWeight.normal,
                      fontSize: 12,
                    ),
                    onSelected: (_) => setState(() => _filter = f),
                  ),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 10),

          // Tasks List
          Expanded(
            child: filtered.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.calendar_today_outlined, size: 48, color: Colors.white24),
                        const SizedBox(height: 12),
                        const Text('No study tasks in this list.', style: TextStyle(color: Colors.white54, fontSize: 14)),
                        const SizedBox(height: 12),
                        ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(backgroundColor: AppTheme.brandPrimary),
                          icon: const Icon(Icons.add, size: 16),
                          label: const Text('Add Your First Task'),
                          onPressed: () => _showAddTaskDialog(context),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    itemCount: filtered.length,
                    itemBuilder: (context, idx) {
                      final task = filtered[idx];
                      return Card(
                        color: AppTheme.cardDark,
                        margin: const EdgeInsets.only(bottom: 10),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                          side: BorderSide(color: task.isCompleted ? AppTheme.brandGreen.withOpacity(0.4) : AppTheme.borderDark),
                        ),
                        child: ListTile(
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                          leading: IconButton(
                            icon: Icon(
                              task.isCompleted ? Icons.check_circle : Icons.radio_button_unchecked,
                              color: task.isCompleted ? AppTheme.brandGreen : Colors.white38,
                              size: 24,
                            ),
                            onPressed: () => appState.toggleTask(task.id),
                          ),
                          title: Text(
                            task.title,
                            style: TextStyle(
                              color: task.isCompleted ? Colors.white38 : Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                              decoration: task.isCompleted ? TextDecoration.lineThrough : null,
                            ),
                          ),
                          subtitle: Text(
                            '${task.subject} • ${task.durationMinutes} mins',
                            style: const TextStyle(color: Colors.white54, fontSize: 11),
                          ),
                          trailing: IconButton(
                            icon: const Icon(Icons.delete_outline, color: Colors.white38, size: 20),
                            onPressed: () => appState.deleteTask(task.id),
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
