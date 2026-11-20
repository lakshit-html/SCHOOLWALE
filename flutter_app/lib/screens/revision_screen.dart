import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../theme/app_theme.dart';

class RevisionItem {
  final String id;
  final String title;
  final String subject;
  final int intervalDays;
  final DateTime nextReviewDate;
  final bool isCompleted;

  RevisionItem({
    required this.id,
    required this.title,
    required this.subject,
    required this.intervalDays,
    required this.nextReviewDate,
    this.isCompleted = false,
  });

  RevisionItem copyWith({
    int? intervalDays,
    DateTime? nextReviewDate,
    bool? isCompleted,
  }) {
    return RevisionItem(
      id: id,
      title: title,
      subject: subject,
      intervalDays: intervalDays ?? this.intervalDays,
      nextReviewDate: nextReviewDate ?? this.nextReviewDate,
      isCompleted: isCompleted ?? this.isCompleted,
    );
  }
}

class RevisionScreen extends StatefulWidget {
  const RevisionScreen({Key? key}) : super(key: key);

  @override
  State<RevisionScreen> createState() => _RevisionScreenState();
}

class _RevisionScreenState extends State<RevisionScreen> {
  final List<RevisionItem> _items = [
    RevisionItem(
      id: 'rev_1',
      title: 'Gauss Law & Electric Dipole in Uniform Field',
      subject: 'Physics',
      intervalDays: 1,
      nextReviewDate: DateTime.now(),
    ),
    RevisionItem(
      id: 'rev_2',
      title: 'Raoult\'s Law & Colligative Properties Numericals',
      subject: 'Chemistry',
      intervalDays: 3,
      nextReviewDate: DateTime.now(),
    ),
    RevisionItem(
      id: 'rev_3',
      title: 'Matrix Properties & Determinant Transformations',
      subject: 'Mathematics',
      intervalDays: 7,
      nextReviewDate: DateTime.now().add(const Duration(days: 2)),
    ),
    RevisionItem(
      id: 'rev_4',
      title: 'Replication Fork & DNA Transcription Steps',
      subject: 'Biology',
      intervalDays: 14,
      nextReviewDate: DateTime.now().add(const Duration(days: 5)),
    ),
  ];

  String _filter = 'due';

  void _showAddTopicDialog(BuildContext context) {
    final titleCtrl = TextEditingController();
    String selectedSubject = 'Physics';
    final subjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology'];

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          backgroundColor: AppTheme.cardDark,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Text('Schedule Spaced Revision', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: titleCtrl,
                style: const TextStyle(color: Colors.white, fontSize: 14),
                decoration: InputDecoration(
                  hintText: 'e.g. Photoelectric Effect Derivations',
                  hintStyle: const TextStyle(color: Colors.white38),
                  filled: true,
                  fillColor: AppTheme.bgDark,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                ),
              ),
              const SizedBox(height: 12),
              DropdownButton<String>(
                value: selectedSubject,
                isExpanded: true,
                dropdownColor: AppTheme.cardDark,
                underline: const SizedBox(),
                items: subjects.map((s) => DropdownMenuItem(value: s, child: Text(s, style: const TextStyle(color: Colors.white)))).toList(),
                onChanged: (val) {
                  if (val != null) setDialogState(() => selectedSubject = val);
                },
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel', style: TextStyle(color: Colors.white54))),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: AppTheme.brandPrimary),
              onPressed: () {
                if (titleCtrl.text.trim().isNotEmpty) {
                  setState(() {
                    _items.insert(
                      0,
                      RevisionItem(
                        id: 'rev_${DateTime.now().millisecondsSinceEpoch}',
                        title: titleCtrl.text.trim(),
                        subject: selectedSubject,
                        intervalDays: 1,
                        nextReviewDate: DateTime.now(),
                      ),
                    );
                  });
                  Navigator.pop(ctx);
                }
              },
              child: const Text('Schedule', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      ),
    );
  }

  void _markReviewed(RevisionItem item, int confidence) {
    // confidence: 1: Hard (+1d), 2: Good (+3d), 3: Easy (+7d)
    final addDays = confidence == 1 ? 1 : (confidence == 2 ? 3 : 7);
    final appState = context.read<AppState>();
    appState.addXp(60, coins: 12);

    setState(() {
      final idx = _items.indexWhere((i) => i.id == item.id);
      if (idx != -1) {
        _items[idx] = item.copyWith(
          intervalDays: item.intervalDays + addDays,
          nextReviewDate: DateTime.now().add(Duration(days: addDays)),
          isCompleted: true,
        );
      }
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: AppTheme.brandGreen,
        content: Text('Reviewed! Next interval in $addDays days (+60 XP, +12 Coins)', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();
    final dueItems = _items.where((i) => !i.isCompleted && i.nextReviewDate.isBefore(now.add(const Duration(hours: 12)))).toList();
    final upcomingItems = _items.where((i) => !i.isCompleted && i.nextReviewDate.isAfter(now.add(const Duration(hours: 12)))).toList();
    final completedItems = _items.where((i) => i.isCompleted).toList();

    List<RevisionItem> displayed = dueItems;
    if (_filter == 'upcoming') displayed = upcomingItems;
    if (_filter == 'completed') displayed = completedItems;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Spaced Repetition Engine', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_circle, color: AppTheme.brandPrimary),
            tooltip: 'Add Topic',
            onPressed: () => _showAddTopicDialog(context),
          ),
        ],
      ),
      body: Column(
        children: [
          // Filter Tabs
          Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                _buildFilterChip('Due Today (${dueItems.length})', 'due'),
                const SizedBox(width: 8),
                _buildFilterChip('Upcoming (${upcomingItems.length})', 'upcoming'),
                const SizedBox(width: 8),
                _buildFilterChip('Mastered (${completedItems.length})', 'completed'),
              ],
            ),
          ),

          Expanded(
            child: displayed.isEmpty
                ? Center(
                    child: Text(
                      _filter == 'due' ? 'No revisions due today! Great job!' : 'No topics found.',
                      style: const TextStyle(color: Colors.white54, fontSize: 14),
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(12),
                    itemCount: displayed.length,
                    itemBuilder: (context, i) {
                      final item = displayed[i];
                      return Card(
                        color: AppTheme.cardDark,
                        margin: const EdgeInsets.only(bottom: 10),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                          side: const BorderSide(color: AppTheme.borderDark),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(14),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                    decoration: BoxDecoration(
                                      color: AppTheme.brandPrimary.withOpacity(0.2),
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Text(
                                      item.subject,
                                      style: const TextStyle(color: AppTheme.brandPrimary, fontSize: 11, fontWeight: FontWeight.bold),
                                    ),
                                  ),
                                  const Spacer(),
                                  Text(
                                    'Interval: ${item.intervalDays}d',
                                    style: const TextStyle(color: Colors.white38, fontSize: 11),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              Text(
                                item.title,
                                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                              ),
                              const SizedBox(height: 12),

                              if (!item.isCompleted)
                                Row(
                                  children: [
                                    const Text('Rate Recall:', style: TextStyle(color: Colors.white54, fontSize: 11)),
                                    const Spacer(),
                                    _buildConfidenceBtn('Hard (+1d)', AppTheme.brandRose, () => _markReviewed(item, 1)),
                                    const SizedBox(width: 6),
                                    _buildConfidenceBtn('Good (+3d)', AppTheme.brandBlue, () => _markReviewed(item, 2)),
                                    const SizedBox(width: 6),
                                    _buildConfidenceBtn('Easy (+7d)', AppTheme.brandGreen, () => _markReviewed(item, 3)),
                                  ],
                                )
                              else
                                const Row(
                                  children: [
                                    Icon(Icons.check_circle, color: AppTheme.brandGreen, size: 16),
                                    SizedBox(width: 6),
                                    Text('Reviewed and scheduled for next interval', style: TextStyle(color: AppTheme.brandGreen, fontSize: 12)),
                                  ],
                                ),
                            ],
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

  Widget _buildConfidenceBtn(String text, Color color, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: color.withOpacity(0.15),
          border: Border.all(color: color.withOpacity(0.5)),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Text(text, style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.bold)),
      ),
    );
  }

  Widget _buildFilterChip(String label, String value) {
    final isSelected = _filter == value;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _filter = value),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: isSelected ? AppTheme.brandPrimary : AppTheme.cardDark,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: isSelected ? AppTheme.brandPrimary : AppTheme.borderDark),
          ),
          child: Center(
            child: Text(
              label,
              style: TextStyle(
                color: isSelected ? Colors.white : Colors.white60,
                fontSize: 11,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
