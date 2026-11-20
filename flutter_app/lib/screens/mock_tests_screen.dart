import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../theme/app_theme.dart';

class MockTestRecord {
  final String id;
  final String title;
  final String subject;
  final int score;
  final int maxMarks;
  final String mistakeType; // 'Silly Mistake', 'Concept Gap', 'Time Pressure'
  final DateTime date;

  MockTestRecord({
    required this.id,
    required this.title,
    required this.subject,
    required this.score,
    required this.maxMarks,
    required this.mistakeType,
    required this.date,
  });

  double get percentage => maxMarks > 0 ? (score / maxMarks) * 100 : 0.0;
}

class MockTestsScreen extends StatefulWidget {
  const MockTestsScreen({Key? key}) : super(key: key);

  @override
  State<MockTestsScreen> createState() => _MockTestsScreenState();
}

class _MockTestsScreenState extends State<MockTestsScreen> {
  final List<MockTestRecord> _tests = [];

  void _showAddTestDialog() {
    final titleCtrl = TextEditingController();
    final scoreCtrl = TextEditingController(text: '75');
    final maxCtrl = TextEditingController(text: '100');
    String selectedSubject = 'Physics';
    String selectedMistake = 'Silly Mistake';

    final subjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Full Mock'];
    final mistakeTypes = ['Silly Mistake', 'Concept Gap', 'Time Pressure', 'None (Flawless)'];

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          backgroundColor: AppTheme.cardDark,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Text('Log Mock Test Score', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: titleCtrl,
                  style: const TextStyle(color: Colors.white, fontSize: 14),
                  decoration: InputDecoration(
                    hintText: 'e.g. Chapter Test: Electrostatics Part 1',
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
                        value: selectedMistake,
                        isExpanded: true,
                        dropdownColor: AppTheme.cardDark,
                        underline: const SizedBox(),
                        items: mistakeTypes.map((m) => DropdownMenuItem(value: m, child: Text(m, style: const TextStyle(color: Colors.white, fontSize: 12)))).toList(),
                        onChanged: (val) {
                          if (val != null) setDialogState(() => selectedMistake = val);
                        },
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: scoreCtrl,
                        keyboardType: TextInputType.number,
                        style: const TextStyle(color: Colors.white, fontSize: 14),
                        decoration: InputDecoration(
                          labelText: 'Your Score',
                          labelStyle: const TextStyle(color: Colors.white54),
                          filled: true,
                          fillColor: AppTheme.bgDark,
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: TextField(
                        controller: maxCtrl,
                        keyboardType: TextInputType.number,
                        style: const TextStyle(color: Colors.white, fontSize: 14),
                        decoration: InputDecoration(
                          labelText: 'Total Marks',
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
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel', style: TextStyle(color: Colors.white54))),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: AppTheme.brandPrimary),
              onPressed: () {
                if (titleCtrl.text.trim().isNotEmpty) {
                  final score = int.tryParse(scoreCtrl.text) ?? 0;
                  final max = int.tryParse(maxCtrl.text) ?? 100;

                  setState(() {
                    _tests.insert(
                      0,
                      MockTestRecord(
                        id: 'test_${DateTime.now().millisecondsSinceEpoch}',
                        title: titleCtrl.text.trim(),
                        subject: selectedSubject,
                        score: score,
                        maxMarks: max,
                        mistakeType: selectedMistake,
                        date: DateTime.now(),
                      ),
                    );
                  });
                  context.read<AppState>().addXp(120, coins: 25);
                  Navigator.pop(ctx);
                }
              },
              child: const Text('Save Test', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final average = _tests.isNotEmpty
        ? (_tests.fold<double>(0.0, (acc, t) => acc + t.percentage) / _tests.length)
        : 0.0;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mock Test Diagnostics', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_circle, color: AppTheme.brandPrimary),
            tooltip: 'Log Test Score',
            onPressed: _showAddTestDialog,
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Average Score Performance Card
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF047857), Color(0xFF065F46), Color(0xFF022C22)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppTheme.brandGreen.withOpacity(0.4)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Test Performance Average', style: TextStyle(color: Colors.white70, fontSize: 12)),
                    const SizedBox(height: 4),
                    Text(
                      '${average.toStringAsFixed(1)}%',
                      style: const TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 2),
                    Text('${_tests.length} mock tests logged', style: const TextStyle(color: Colors.white60, fontSize: 11)),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: const BoxDecoration(color: Colors.white12, shape: BoxShape.circle),
                  child: const Icon(Icons.military_tech, color: AppTheme.brandGold, size: 36),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          const Text('Logged Exam Simulations', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
          const SizedBox(height: 10),

          if (_tests.isEmpty)
            Center(
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 40),
                child: Column(
                  children: [
                    const Icon(Icons.school_outlined, size: 48, color: Colors.white24),
                    const SizedBox(height: 12),
                    const Text('No mock test scores logged yet.', style: TextStyle(color: Colors.white54, fontSize: 14)),
                    const SizedBox(height: 12),
                    ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(backgroundColor: AppTheme.brandPrimary),
                      icon: const Icon(Icons.add, size: 16),
                      label: const Text('Log First Mock Test'),
                      onPressed: _showAddTestDialog,
                    ),
                  ],
                ),
              ),
            )
          else
            ..._tests.map((t) {
              final pct = t.percentage;
              Color color = pct >= 80 ? AppTheme.brandGreen : (pct >= 50 ? Colors.amber : AppTheme.brandRose);

              return Card(
                color: AppTheme.cardDark,
                margin: const EdgeInsets.only(bottom: 10),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                  side: const BorderSide(color: AppTheme.borderDark),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(14),
                  child: Row(
                    children: [
                      Container(
                        width: 52,
                        height: 52,
                        decoration: BoxDecoration(
                          color: color.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: color.withOpacity(0.5)),
                        ),
                        child: Center(
                          child: Text(
                            '${pct.toInt()}%',
                            style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 14),
                          ),
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(t.title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                            const SizedBox(height: 4),
                            Text(
                              '${t.subject} • Score: ${t.score}/${t.maxMarks}',
                              style: const TextStyle(color: Colors.white60, fontSize: 12),
                            ),
                            const SizedBox(height: 4),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(color: Colors.white10, borderRadius: BorderRadius.circular(6)),
                              child: Text('Diagnosis: ${t.mistakeType}', style: const TextStyle(color: Colors.white70, fontSize: 10)),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }).toList(),
        ],
      ),
    );
  }
}
