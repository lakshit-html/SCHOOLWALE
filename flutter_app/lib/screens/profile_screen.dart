import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../models/user_profile.dart';
import '../theme/app_theme.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({Key? key}) : super(key: key);

  void _showEditProfileDialog(BuildContext context, AppState appState) {
    final nameCtrl = TextEditingController(text: appState.profile.name);
    final examCtrl = TextEditingController(text: appState.profile.targetExam);
    String selectedGrade = appState.profile.grade;
    int studyHours = appState.profile.studyHoursGoal;

    final grades = ['Class 9', 'Class 10', 'Class 11', 'Class 12', 'Dropper / Repeater'];

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          backgroundColor: AppTheme.cardDark,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Row(
            children: [
              Icon(Icons.edit_note, color: AppTheme.brandPrimary),
              SizedBox(width: 8),
              Text('Edit Scholar Profile', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
            ],
          ),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Student Name', style: TextStyle(color: Colors.white70, fontSize: 12)),
                const SizedBox(height: 4),
                TextField(
                  controller: nameCtrl,
                  style: const TextStyle(color: Colors.white, fontSize: 14),
                  decoration: InputDecoration(
                    filled: true,
                    fillColor: AppTheme.bgDark,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                  ),
                ),
                const SizedBox(height: 14),

                const Text('Grade / Class', style: TextStyle(color: Colors.white70, fontSize: 12)),
                const SizedBox(height: 4),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  decoration: BoxDecoration(
                    color: AppTheme.bgDark,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: DropdownButton<String>(
                    value: grades.contains(selectedGrade) ? selectedGrade : grades[3],
                    isExpanded: true,
                    dropdownColor: AppTheme.cardDark,
                    underline: const SizedBox(),
                    items: grades.map((g) => DropdownMenuItem(value: g, child: Text(g, style: const TextStyle(color: Colors.white)))).toList(),
                    onChanged: (val) {
                      if (val != null) setDialogState(() => selectedGrade = val);
                    },
                  ),
                ),
                const SizedBox(height: 14),

                const Text('Target Exam', style: TextStyle(color: Colors.white70, fontSize: 12)),
                const SizedBox(height: 4),
                TextField(
                  controller: examCtrl,
                  style: const TextStyle(color: Colors.white, fontSize: 14),
                  decoration: InputDecoration(
                    filled: true,
                    fillColor: AppTheme.bgDark,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                  ),
                ),
                const SizedBox(height: 14),

                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Daily Goal (Hours)', style: TextStyle(color: Colors.white70, fontSize: 12)),
                    Text('$studyHours hrs/day', style: const TextStyle(color: AppTheme.brandPrimary, fontWeight: FontWeight.bold)),
                  ],
                ),
                Slider(
                  value: studyHours.toDouble(),
                  min: 1,
                  max: 16,
                  divisions: 15,
                  activeColor: AppTheme.brandPrimary,
                  onChanged: (val) => setDialogState(() => studyHours = val.round()),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Cancel', style: TextStyle(color: Colors.white54)),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: AppTheme.brandPrimary),
              onPressed: () {
                final updated = appState.profile.copyWith(
                  name: nameCtrl.text.trim().isEmpty ? 'Aspiring Scholar' : nameCtrl.text.trim(),
                  grade: selectedGrade,
                  targetExam: examCtrl.text.trim().isEmpty ? 'CBSE + JEE/NEET' : examCtrl.text.trim(),
                  studyHoursGoal: studyHours,
                );
                appState.updateProfile(updated);
                Navigator.pop(ctx);
              },
              child: const Text('Save Profile', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      ),
    );
  }

  void _showImportDialog(BuildContext context, AppState appState) {
    final jsonCtrl = TextEditingController();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.cardDark,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Row(
          children: [
            Icon(Icons.download, color: AppTheme.brandBlue),
            SizedBox(width: 8),
            Text('Import Database', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Paste a previously exported StudyForge JSON backup to restore your tasks, profile, and study records:',
              style: TextStyle(color: Colors.white70, fontSize: 12),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: jsonCtrl,
              maxLines: 6,
              style: const TextStyle(color: Colors.white, fontSize: 12, fontFamily: 'monospace'),
              decoration: InputDecoration(
                hintText: '{\n  "version": "1.0.0",\n  "profile": { ... }\n}',
                hintStyle: const TextStyle(color: Colors.white30, fontSize: 11),
                filled: true,
                fillColor: AppTheme.bgDark,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel', style: TextStyle(color: Colors.white54)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppTheme.brandBlue),
            onPressed: () async {
              final raw = jsonCtrl.text.trim();
              if (raw.isEmpty) return;

              final success = await appState.importDatabaseJson(raw);
              Navigator.pop(ctx);
              if (context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    backgroundColor: success ? AppTheme.brandGreen : AppTheme.brandRose,
                    content: Text(
                      success ? 'Database imported successfully!' : 'Failed to import: Invalid JSON format.',
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                    ),
                  ),
                );
              }
            },
            child: const Text('Restore Data', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  void _showResetConfirmDialog(BuildContext context, AppState appState) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.cardDark,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Row(
          children: [
            Icon(Icons.warning_amber_rounded, color: AppTheme.brandRose),
            SizedBox(width: 8),
            Text('Reset Database?', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
          ],
        ),
        content: const Text(
          'This will clear all local student tasks, timer records, and preferences, restoring fresh default starter state. This action cannot be undone.',
          style: TextStyle(color: Colors.white70, fontSize: 13),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel', style: TextStyle(color: Colors.white54)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppTheme.brandRose),
            onPressed: () async {
              await appState.resetDatabase();
              Navigator.pop(ctx);
              if (context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    backgroundColor: AppTheme.brandRose,
                    content: Text('Database reset to factory defaults.', style: TextStyle(color: Colors.white)),
                  ),
                );
              }
            },
            child: const Text('Confirm Reset', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final profile = appState.profile;
    final xpForNextLevel = profile.level * 500;
    final xpCurrentProgress = (profile.xp % 500);
    final xpProgressRatio = (xpCurrentProgress / 500.0).clamp(0.0, 1.0);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Scholar Profile & Database', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit, color: AppTheme.brandPrimary),
            tooltip: 'Edit Profile',
            onPressed: () => _showEditProfileDialog(context, appState),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Scholar Hero Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF312E81), Color(0xFF1E1B4B)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: AppTheme.brandPrimary.withOpacity(0.5)),
              ),
              child: Column(
                children: [
                  Row(
                    children: [
                      Container(
                        width: 60,
                        height: 60,
                        decoration: BoxDecoration(
                          color: AppTheme.brandPrimary,
                          borderRadius: BorderRadius.circular(20),
                          boxShadow: [
                            BoxShadow(color: AppTheme.brandPrimary.withOpacity(0.4), blurRadius: 10),
                          ],
                        ),
                        child: const Center(
                          child: Icon(Icons.school, color: Colors.white, size: 32),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              profile.name,
                              style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '${profile.grade} • ${profile.targetExam}',
                              style: const TextStyle(color: Colors.white70, fontSize: 13),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Level & XP Bar
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Level ${profile.level} Scholar',
                        style: const TextStyle(color: AppTheme.brandGold, fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                      Text(
                        '${profile.xp} / $xpForNextLevel XP',
                        style: const TextStyle(color: Colors.white60, fontSize: 12),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: LinearProgressIndicator(
                      value: xpProgressRatio,
                      backgroundColor: Colors.white12,
                      valueColor: const AlwaysStoppedAnimation(AppTheme.brandGold),
                      minHeight: 8,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Stat Badges Row
            Row(
              children: [
                _buildStatPill(Icons.local_fire_department, '${profile.currentStreak} Days', 'Study Streak', Colors.amber),
                const SizedBox(width: 10),
                _buildStatPill(Icons.monetization_on, '${profile.coins} Coins', 'Forge Rewards', AppTheme.brandGold),
                const SizedBox(width: 10),
                _buildStatPill(Icons.timer, '${appState.timerCompletedSessions}', 'Sessions', AppTheme.brandBlue),
              ],
            ),
            const SizedBox(height: 24),

            // Local Database Vault Card
            const Text(
              'Local Database & Storage Vault',
              style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Text(
              'All tasks, profile data, and study records are stored in a fully offline-first local database on your device.',
              style: TextStyle(color: Colors.white60, fontSize: 12),
            ),
            const SizedBox(height: 14),

            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.cardDark,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.borderDark),
              ),
              child: Column(
                children: [
                  _buildVaultMetricRow('Active Study Tasks', '${appState.tasks.length} stored records'),
                  const Divider(color: AppTheme.borderDark, height: 20),
                  _buildVaultMetricRow('Focus Sessions Completed', '${appState.timerCompletedSessions} sessions'),
                  const Divider(color: AppTheme.borderDark, height: 20),
                  _buildVaultMetricRow('Database Engine', 'SharedPreferences Key-Value Store (v1.0)'),
                  const SizedBox(height: 16),

                  // Vault Action Buttons
                  Row(
                    children: [
                      // Export Button
                      Expanded(
                        child: ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.brandPrimary,
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                          icon: const Icon(Icons.copy_all, size: 16, color: Colors.white),
                          label: const Text('Export JSON', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
                          onPressed: () async {
                            final jsonStr = await appState.exportDatabaseJson();
                            await Clipboard.setData(ClipboardData(text: jsonStr));
                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  backgroundColor: AppTheme.brandGreen,
                                  content: Text('Database JSON copied to clipboard!', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                                ),
                              );
                            }
                          },
                        ),
                      ),
                      const SizedBox(width: 10),

                      // Import Button
                      Expanded(
                        child: OutlinedButton.icon(
                          style: OutlinedButton.styleFrom(
                            foregroundColor: AppTheme.brandBlue,
                            side: const BorderSide(color: AppTheme.brandBlue),
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                          icon: const Icon(Icons.file_upload_outlined, size: 16),
                          label: const Text('Import JSON', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                          onPressed: () => _showImportDialog(context, appState),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),

                  // Factory Reset Button
                  SizedBox(
                    width: double.infinity,
                    child: TextButton.icon(
                      style: TextButton.styleFrom(
                        foregroundColor: AppTheme.brandRose,
                        padding: const EdgeInsets.symmetric(vertical: 10),
                      ),
                      icon: const Icon(Icons.delete_forever, size: 18),
                      label: const Text('Factory Reset Local Database', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                      onPressed: () => _showResetConfirmDialog(context, appState),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatPill(IconData icon, String value, String label, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
        decoration: BoxDecoration(
          color: AppTheme.cardDark,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppTheme.borderDark),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 22),
            const SizedBox(height: 6),
            Text(value, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
            const SizedBox(height: 2),
            Text(label, style: const TextStyle(color: Colors.white54, fontSize: 10)),
          ],
        ),
      ),
    );
  }

  Widget _buildVaultMetricRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(color: Colors.white70, fontSize: 13)),
        Text(value, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 13)),
      ],
    );
  }
}
