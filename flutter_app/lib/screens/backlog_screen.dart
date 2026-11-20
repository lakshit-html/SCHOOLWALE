import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../theme/app_theme.dart';

class BacklogItem {
  final String id;
  final String title;
  final String subject;
  final int estimatedHours;
  final String priority; // High, Medium, Low
  final bool isCleared;

  BacklogItem({
    required this.id,
    required this.title,
    required this.subject,
    required this.estimatedHours,
    required this.priority,
    this.isCleared = false,
  });

  BacklogItem copyWith({bool? isCleared}) {
    return BacklogItem(
      id: id,
      title: title,
      subject: subject,
      estimatedHours: estimatedHours,
      priority: priority,
      isCleared: isCleared ?? this.isCleared,
    );
  }
}

class BacklogScreen extends StatefulWidget {
  const BacklogScreen({Key? key}) : super(key: key);

  @override
  State<BacklogScreen> createState() => _BacklogScreenState();
}

class _BacklogScreenState extends State<BacklogScreen> {
  final List<BacklogItem> _backlogs = [
    BacklogItem(
      id: 'bl_1',
      title: 'Rotational Dynamics: Moment of Inertia & Rolling',
      subject: 'Physics',
      estimatedHours: 4,
      priority: 'High',
    ),
    BacklogItem(
      id: 'bl_2',
      title: 'Coordination Compounds: CFT & Isomerism',
      subject: 'Chemistry',
      estimatedHours: 3,
      priority: 'High',
    ),
    BacklogItem(
      id: 'bl_3',
      title: 'Definite Integration: By Parts & King\'s Property',
      subject: 'Mathematics',
      estimatedHours: 5,
      priority: 'Medium',
    ),
    BacklogItem(
      id: 'bl_4',
      title: 'Molecular Basis of Inheritance: Operon Model',
      subject: 'Biology',
      estimatedHours: 2,
      priority: 'Medium',
    ),
    BacklogItem(
      id: 'bl_5',
      title: 'Wave Optics: Young\'s Double Slit & Diffraction',
      subject: 'Physics',
      estimatedHours: 3,
      priority: 'Low',
      isCleared: true,
    ),
  ];

  void _showAddDialog() {
    final titleCtrl = TextEditingController();
    final hoursCtrl = TextEditingController(text: '3');
    String selectedSubject = 'Physics';
    String selectedPriority = 'High';

    final subjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology'];
    final priorities = ['High', 'Medium', 'Low'];

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          backgroundColor: AppTheme.cardDark,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Row(
            children: [
              Icon(Icons.playlist_add_check, color: AppTheme.brandPrimary),
              SizedBox(width: 8),
              Text('Add Backlog Topic', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
            ],
          ),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: titleCtrl,
                  style: const TextStyle(color: Colors.white, fontSize: 14),
                  decoration: InputDecoration(
                    hintText: 'e.g. Thermodynamics Carnot Cycle',
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
                      child: DropdownButton<String>(
                        value: selectedPriority,
                        isExpanded: true,
                        dropdownColor: AppTheme.cardDark,
                        underline: const SizedBox(),
                        items: priorities.map((p) => DropdownMenuItem(value: p, child: Text(p, style: const TextStyle(color: Colors.white)))).toList(),
                        onChanged: (val) {
                          if (val != null) setDialogState(() => selectedPriority = val);
                        },
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: hoursCtrl,
                  keyboardType: TextInputType.number,
                  style: const TextStyle(color: Colors.white, fontSize: 14),
                  decoration: InputDecoration(
                    labelText: 'Estimated Hours',
                    labelStyle: const TextStyle(color: Colors.white54),
                    filled: true,
                    fillColor: AppTheme.bgDark,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                  ),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel', style: TextStyle(color: Colors.white54))),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: AppTheme.brandPrimary),
              onPressed: () {
                if (titleCtrl.text.trim().isNotEmpty) {
                  setState(() {
                    _backlogs.insert(
                      0,
                      BacklogItem(
                        id: 'bl_${DateTime.now().millisecondsSinceEpoch}',
                        title: titleCtrl.text.trim(),
                        subject: selectedSubject,
                        estimatedHours: int.tryParse(hoursCtrl.text) ?? 3,
                        priority: selectedPriority,
                      ),
                    );
                  });
                  Navigator.pop(ctx);
                }
              },
              child: const Text('Add Backlog', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      ),
    );
  }

  void _toggleClear(BacklogItem item) {
    final nextCleared = !item.isCleared;
    if (nextCleared) {
      context.read<AppState>().addXp(80, coins: 25);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          backgroundColor: AppTheme.brandGreen,
          content: Text('Backlog Cleared! +80 XP, +25 Coins', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        ),
      );
    }
    setState(() {
      final idx = _backlogs.indexWhere((b) => b.id == item.id);
      if (idx != -1) {
        _backlogs[idx] = item.copyWith(isCleared: nextCleared);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final total = _backlogs.length;
    final cleared = _backlogs.where((b) => b.isCleared).length;
    final pending = total - cleared;
    final progress = total > 0 ? (cleared / total) : 0.0;
    final totalHoursPending = _backlogs.where((b) => !b.isCleared).fold<int>(0, (acc, b) => acc + b.estimatedHours);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Backlog Elimination Engine', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_circle, color: AppTheme.brandPrimary),
            tooltip: 'Add Backlog Topic',
            onPressed: _showAddDialog,
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Clearance Meter Card
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF881337), Color(0xFF4C0519), Color(0xFF1E1B4B)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppTheme.brandRose.withOpacity(0.4)),
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
                        const Text('Total Backlogs Remaining', style: TextStyle(color: Colors.white70, fontSize: 12)),
                        const SizedBox(height: 4),
                        Text('$pending Topics', style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
                      ],
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.white12,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text('~$totalHoursPending Hours', style: const TextStyle(color: AppTheme.brandGold, fontWeight: FontWeight.bold, fontSize: 13)),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('${(progress * 100).toInt()}% Cleared', style: const TextStyle(color: AppTheme.brandGreen, fontSize: 12, fontWeight: FontWeight.bold)),
                    Text('$cleared of $total topics done', style: const TextStyle(color: Colors.white54, fontSize: 11)),
                  ],
                ),
                const SizedBox(height: 6),
                ClipRRect(
                  borderRadius: BorderRadius.circular(6),
                  child: LinearProgressIndicator(
                    value: progress,
                    minHeight: 8,
                    backgroundColor: Colors.white12,
                    valueColor: const AlwaysStoppedAnimation(AppTheme.brandGreen),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          const Text('Pending Backlog Topics', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
          const SizedBox(height: 10),

          ..._backlogs.map((item) {
            Color priorityColor = AppTheme.brandRose;
            if (item.priority == 'Medium') priorityColor = Colors.amber;
            if (item.priority == 'Low') priorityColor = AppTheme.brandBlue;

            return Card(
              color: AppTheme.cardDark,
              margin: const EdgeInsets.only(bottom: 10),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: BorderSide(color: item.isCleared ? AppTheme.brandGreen.withOpacity(0.4) : AppTheme.borderDark),
              ),
              child: ListTile(
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                leading: IconButton(
                  icon: Icon(
                    item.isCleared ? Icons.check_circle : Icons.radio_button_unchecked,
                    color: item.isCleared ? AppTheme.brandGreen : Colors.white38,
                    size: 24,
                  ),
                  onPressed: () => _toggleClear(item),
                ),
                title: Text(
                  item.title,
                  style: TextStyle(
                    color: item.isCleared ? Colors.white38 : Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                    decoration: item.isCleared ? TextDecoration.lineThrough : null,
                  ),
                ),
                subtitle: Padding(
                  padding: const EdgeInsets.only(top: 6),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppTheme.brandPrimary.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(item.subject, style: const TextStyle(color: AppTheme.brandPrimary, fontSize: 10, fontWeight: FontWeight.bold)),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: priorityColor.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text('${item.priority} Priority', style: TextStyle(color: priorityColor, fontSize: 10, fontWeight: FontWeight.bold)),
                      ),
                      const Spacer(),
                      Text('~${item.estimatedHours}h', style: const TextStyle(color: Colors.white54, fontSize: 11)),
                    ],
                  ),
                ),
              ),
            );
          }).toList(),
        ],
      ),
    );
  }
}
