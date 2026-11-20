import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/quiz_question.dart';
import '../services/procedural_quiz_generator.dart';
import '../services/gemini_service.dart';
import '../providers/app_state.dart';
import '../theme/app_theme.dart';

class StudyArenaScreen extends StatefulWidget {
  const StudyArenaScreen({Key? key}) : super(key: key);

  @override
  State<StudyArenaScreen> createState() => _StudyArenaScreenState();
}

class _StudyArenaScreenState extends State<StudyArenaScreen> {
  List<QuizQuestion> _questions = [];
  int _currentIndex = 0;
  int _score = 0;
  int _combo = 0;
  int? _selectedAnswer;
  bool _isAnswerRevealed = false;
  bool _isPlaying = false;
  bool _isGameOver = false;

  Timer? _timer;
  int _timeRemaining = 45;

  final TextEditingController _aiTopicCtrl = TextEditingController();
  bool _isGeneratingAI = false;

  @override
  void initState() {
    super.initState();
    _loadQuestions();
  }

  void _loadQuestions() {
    setState(() {
      _questions = ProceduralQuizGenerator.generateDynamicQuestions('Class 12', count: 5);
    });
  }

  void _startRound() {
    setState(() {
      _isPlaying = true;
      _isGameOver = false;
      _currentIndex = 0;
      _score = 0;
      _combo = 0;
      _selectedAnswer = null;
      _isAnswerRevealed = false;
      _timeRemaining = 45;
    });

    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_timeRemaining > 0) {
        setState(() => _timeRemaining--);
      } else {
        _endRound();
      }
    });
  }

  void _handleSelectAnswer(int index) {
    if (_isAnswerRevealed || !_isPlaying) return;

    final q = _questions[_currentIndex];
    final isCorrect = index == q.correctAnswer;

    setState(() {
      _selectedAnswer = index;
      _isAnswerRevealed = true;
      if (isCorrect) {
        _combo++;
        _score += 100 * _combo;
      } else {
        _combo = 0;
      }
    });

    Future.delayed(const Duration(milliseconds: 1400), () {
      if (!mounted) return;
      if (_currentIndex < _questions.length - 1) {
        setState(() {
          _currentIndex++;
          _selectedAnswer = null;
          _isAnswerRevealed = false;
        });
      } else {
        _endRound();
      }
    });
  }

  void _endRound() {
    _timer?.cancel();
    setState(() {
      _isPlaying = false;
      _isGameOver = true;
    });

    // Award XP
    context.read<AppState>().addXp(_score ~/ 2, coins: _combo * 2);
  }

  Future<void> _generateAIQuiz() async {
    final topic = _aiTopicCtrl.text.trim();
    if (topic.isEmpty || _isGeneratingAI) return;

    setState(() => _isGeneratingAI = true);
    try {
      final generated = await GeminiService.generateAIQuestions(topic, 'Class 12', count: 5);
      if (generated.isNotEmpty) {
        setState(() {
          _questions = generated;
        });
        _startRound();
      } else {
        _loadQuestions();
        _startRound();
      }
    } finally {
      if (mounted) setState(() => _isGeneratingAI = false);
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    _aiTopicCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Study Arena', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
      ),
      body: _isPlaying ? _buildBattleView() : _buildLobbyView(),
    );
  }

  Widget _buildLobbyView() {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        // Trophy & Boss Banner with Curated Gaming / Arena Imagery
        ClipRRect(
          borderRadius: BorderRadius.circular(24),
          child: Stack(
            children: [
              Image.network(
                'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
                height: 180,
                width: double.infinity,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => Container(height: 180, color: const Color(0xFF4C1D95)),
              ),
              Container(
                height: 180,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      const Color(0xFF4C1D95).withOpacity(0.9),
                      const Color(0xFF1E1B4B).withOpacity(0.85),
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  children: [
                    const Icon(Icons.military_tech, size: 48, color: AppTheme.brandGold),
                    const SizedBox(height: 6),
                    const Text(
                      'Academic Boss Arena',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20, color: Colors.white),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Timed challenge: 45 seconds • Class 9-12 NCERT concepts',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 11, color: Colors.white70),
                    ),
                    const SizedBox(height: 14),
                    ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.brandAccent,
                        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      icon: const Icon(Icons.play_arrow_rounded, color: Colors.white),
                      label: const Text('Start Challenge', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.white)),
                      onPressed: _startRound,
                    )
                  ],
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 24),

        // AI Custom Topic Quiz Generator
        Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: AppTheme.cardDark,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: AppTheme.borderDark),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: const [
                  Icon(Icons.auto_awesome, color: AppTheme.brandGold, size: 18),
                  SizedBox(width: 8),
                  Text('Generate Custom AI Quiz', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.white)),
                ],
              ),
              const SizedBox(height: 8),
              const Text(
                'Enter any chapter or topic (e.g. Thermodynamics, Optics, Matrices) to generate a custom 5-question round.',
                style: TextStyle(fontSize: 11, color: Colors.white54),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _aiTopicCtrl,
                      style: const TextStyle(fontSize: 13, color: Colors.white),
                      decoration: InputDecoration(
                        hintText: 'Enter topic (e.g. Electrostatics)...',
                        hintStyle: const TextStyle(color: Colors.white38, fontSize: 12),
                        filled: true,
                        fillColor: const Color(0xFF1E293B),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.brandPrimary,
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                    onPressed: _isGeneratingAI ? null : _generateAIQuiz,
                    child: _isGeneratingAI
                        ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                        : const Text('AI Round', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.white)),
                  )
                ],
              ),
            ],
          ),
        ),

        const SizedBox(height: 20),

        if (_isGameOver)
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: const Color(0xFF064E3B),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppTheme.brandAccent),
            ),
            child: Column(
              children: [
                const Text('🎉 Round Completed!', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Colors.white)),
                const SizedBox(height: 8),
                Text('Final Score: $_score Points', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.brandGold)),
                const SizedBox(height: 4),
                Text('Awarded +${_score ~/ 2} Academic XP', style: const TextStyle(fontSize: 12, color: Colors.white70)),
              ],
            ),
          )
      ],
    );
  }

  Widget _buildBattleView() {
    if (_questions.isEmpty) return const Center(child: CircularProgressIndicator());

    final q = _questions[_currentIndex];

    return Padding(
      padding: const EdgeInsets.all(18),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // HUD: Timer, Score, Combo
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(Icons.timer_outlined, size: 18, color: AppTheme.brandGold),
                  const SizedBox(width: 4),
                  Text('$_timeRemaining s', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.white)),
                ],
              ),
              if (_combo >= 2)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppTheme.brandRose.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: AppTheme.brandRose),
                  ),
                  child: Text('🔥 ${_combo}x Combo!', style: const TextStyle(color: AppTheme.brandRose, fontWeight: FontWeight.bold, fontSize: 12)),
                ),
              Text('Score: $_score', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppTheme.brandAccent)),
            ],
          ),
          const SizedBox(height: 12),

          // Progress indicator
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: LinearProgressIndicator(
              value: (_currentIndex + 1) / _questions.length,
              minHeight: 6,
              backgroundColor: const Color(0xFF1E293B),
              valueColor: const AlwaysStoppedAnimation(AppTheme.brandPrimary),
            ),
          ),
          const SizedBox(height: 20),

          // Question Card
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: AppTheme.cardDark,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppTheme.borderDark),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(color: AppTheme.brandPrimary.withOpacity(0.2), borderRadius: BorderRadius.circular(8)),
                      child: Text(q.subject, style: const TextStyle(color: AppTheme.brandAccent, fontSize: 11, fontWeight: FontWeight.bold)),
                    ),
                    const SizedBox(width: 8),
                    Text('Question ${_currentIndex + 1} of ${_questions.length}', style: const TextStyle(color: Colors.white54, fontSize: 11)),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  q.question,
                  style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: Colors.white, height: 1.4),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Options
          Expanded(
            child: ListView.builder(
              itemCount: q.options.length,
              itemBuilder: (context, idx) {
                Color borderCol = AppTheme.borderDark;
                Color bgCol = const Color(0xFF1E293B);

                if (_isAnswerRevealed) {
                  if (idx == q.correctAnswer) {
                    borderCol = AppTheme.brandAccent;
                    bgCol = const Color(0xFF064E3B);
                  } else if (idx == _selectedAnswer) {
                    borderCol = AppTheme.brandRose;
                    bgCol = const Color(0xFF4C0519);
                  }
                }

                return GestureDetector(
                  onTap: () => _handleSelectAnswer(idx),
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 10),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    decoration: BoxDecoration(
                      color: bgCol,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: borderCol, width: 1.5),
                    ),
                    child: Row(
                      children: [
                        CircleAvatar(
                          radius: 12,
                          backgroundColor: Colors.black26,
                          child: Text(String.fromCharCode(65 + idx), style: const TextStyle(fontSize: 11, color: Colors.white)),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            q.options[idx],
                            style: const TextStyle(fontSize: 13, color: Colors.white),
                          ),
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
}
