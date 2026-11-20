import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../theme/app_theme.dart';
import 'onboarding_tutorial_screen.dart';

class OnboardingQuestionnaireScreen extends StatefulWidget {
  const OnboardingQuestionnaireScreen({Key? key}) : super(key: key);

  @override
  State<OnboardingQuestionnaireScreen> createState() => _OnboardingQuestionnaireScreenState();
}

class _OnboardingQuestionnaireScreenState extends State<OnboardingQuestionnaireScreen> {
  int _step = 0;

  String _selectedGrade = 'Class 12';
  String _selectedExam = 'CBSE Board + JEE';
  int _dailyHours = 6;

  final List<Map<String, String>> _grades = [
    {'title': 'Class 9', 'desc': 'Foundation & Board Preparation'},
    {'title': 'Class 10', 'desc': 'Secondary Boards & NTSE'},
    {'title': 'Class 11', 'desc': 'Senior Secondary Core Stream'},
    {'title': 'Class 12', 'desc': 'Board Exams & Competitive Sprints'},
    {'title': 'Dropper / Repeater', 'desc': 'Full-Time JEE / NEET Revision'},
  ];

  final List<Map<String, String>> _exams = [
    {'title': 'CBSE Board + JEE', 'desc': 'Engineering Sprint (Physics, Chem, Math)'},
    {'title': 'CBSE Board + NEET', 'desc': 'Medical Sprint (Physics, Chem, Biology)'},
    {'title': 'Pure CBSE / State Boards', 'desc': '100% Board Syllabus & Derivations'},
    {'title': 'CUET / College Entrance', 'desc': 'General & Domain Subjects'},
  ];

  void _handleNext() {
    if (_step < 2) {
      setState(() => _step++);
    } else {
      // Save to profile
      final appState = context.read<AppState>();
      final profile = appState.profile;
      final updated = profile.copyWith(
        grade: _selectedGrade,
        targetExam: _selectedExam,
        studyHoursGoal: _dailyHours,
      );
      appState.updateProfile(updated);

      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const OnboardingTutorialScreen()),
      );
    }
  }

  void _handleBack() {
    if (_step > 0) {
      setState(() => _step--);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.bgDark,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Progress Indicator Bar
              Row(
                children: List.generate(3, (idx) {
                  final isDone = idx <= _step;
                  return Expanded(
                    child: Container(
                      height: 4,
                      margin: EdgeInsets.only(right: idx < 2 ? 8 : 0),
                      decoration: BoxDecoration(
                        color: isDone ? AppTheme.brandPrimary : Colors.white12,
                        borderRadius: BorderRadius.circular(4),
                      ),
                    ),
                  );
                }),
              ),
              const SizedBox(height: 24),

              // Step Title & Subtitle
              Text(
                'Step ${_step + 1} of 3',
                style: const TextStyle(color: AppTheme.brandGold, fontWeight: FontWeight.bold, fontSize: 12),
              ),
              const SizedBox(height: 6),
              Text(
                _step == 0
                    ? 'What is your current Academic Class?'
                    : _step == 1
                        ? 'Which Target Exam are you preparing for?'
                        : 'How many hours can you dedicate daily?',
                style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 6),
              Text(
                _step == 0
                    ? 'StudyForge calibrates NCERT syllabus based on your grade.'
                    : _step == 1
                        ? 'We will prioritize relevant high-yield PYQ concepts.'
                        : 'Your daily study streak and momentum graph will track this.',
                style: const TextStyle(color: Colors.white54, fontSize: 12),
              ),
              const SizedBox(height: 24),

              // Step Content
              Expanded(
                child: _step == 0
                    ? _buildGradeStep()
                    : _step == 1
                        ? _buildExamStep()
                        : _buildHoursStep(),
              ),

              // Bottom Navigation Controls
              Row(
                children: [
                  if (_step > 0)
                    OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.white70,
                        side: const BorderSide(color: AppTheme.borderDark),
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      onPressed: _handleBack,
                      child: const Text('Back'),
                    ),
                  if (_step > 0) const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.brandPrimary,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      onPressed: _handleNext,
                      child: Text(
                        _step == 2 ? 'Continue to App Tour' : 'Next Step',
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                      ),
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

  Widget _buildGradeStep() {
    return ListView.builder(
      itemCount: _grades.length,
      itemBuilder: (context, idx) {
        final g = _grades[idx];
        final isSel = _selectedGrade == g['title'];

        return Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: InkWell(
            onTap: () => setState(() => _selectedGrade = g['title']!),
            borderRadius: BorderRadius.circular(16),
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isSel ? AppTheme.brandPrimary.withOpacity(0.15) : AppTheme.cardDark,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: isSel ? AppTheme.brandPrimary : AppTheme.borderDark,
                  width: isSel ? 1.5 : 1.0,
                ),
              ),
              child: Row(
                children: [
                  Icon(
                    isSel ? Icons.radio_button_checked : Icons.radio_button_unchecked,
                    color: isSel ? AppTheme.brandPrimary : Colors.white38,
                    size: 20,
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(g['title']!, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                        const SizedBox(height: 2),
                        Text(g['desc']!, style: const TextStyle(color: Colors.white54, fontSize: 11)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildExamStep() {
    return ListView.builder(
      itemCount: _exams.length,
      itemBuilder: (context, idx) {
        final ex = _exams[idx];
        final isSel = _selectedExam == ex['title'];

        return Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: InkWell(
            onTap: () => setState(() => _selectedExam = ex['title']!),
            borderRadius: BorderRadius.circular(16),
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isSel ? AppTheme.brandBlue.withOpacity(0.15) : AppTheme.cardDark,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: isSel ? AppTheme.brandBlue : AppTheme.borderDark,
                  width: isSel ? 1.5 : 1.0,
                ),
              ),
              child: Row(
                children: [
                  Icon(
                    isSel ? Icons.radio_button_checked : Icons.radio_button_unchecked,
                    color: isSel ? AppTheme.brandBlue : Colors.white38,
                    size: 20,
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(ex['title']!, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                        const SizedBox(height: 2),
                        Text(ex['desc']!, style: const TextStyle(color: Colors.white54, fontSize: 11)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildHoursStep() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          width: 120,
          height: 120,
          decoration: BoxDecoration(
            color: AppTheme.cardDark,
            shape: BoxShape.circle,
            border: Border.all(color: AppTheme.brandPrimary, width: 2),
            boxShadow: [
              BoxShadow(color: AppTheme.brandPrimary.withOpacity(0.3), blurRadius: 20),
            ],
          ),
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('$_dailyHours', style: const TextStyle(color: Colors.white, fontSize: 36, fontWeight: FontWeight.bold)),
                const Text('Hours / Day', style: TextStyle(color: Colors.white60, fontSize: 11)),
              ],
            ),
          ),
        ),
        const SizedBox(height: 32),
        Slider(
          value: _dailyHours.toDouble(),
          min: 2,
          max: 14,
          divisions: 12,
          activeColor: AppTheme.brandPrimary,
          onChanged: (val) => setState(() => _dailyHours = val.round()),
        ),
        const SizedBox(height: 12),
        Text(
          _dailyHours <= 4
              ? 'Moderate Routine • Good for steady school balance'
              : _dailyHours <= 8
                  ? 'Recommended Routine • Ideal for JEE/NEET + School'
                  : 'Intense Routine • High-output competitive sprint',
          style: const TextStyle(color: AppTheme.brandGold, fontSize: 12, fontWeight: FontWeight.w500),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }
}
