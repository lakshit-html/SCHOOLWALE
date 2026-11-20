import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../theme/app_theme.dart';

enum PomodoroMode { focus, shortBreak, longBreak }

class PomodoroScreen extends StatefulWidget {
  const PomodoroScreen({Key? key}) : super(key: key);

  @override
  State<PomodoroScreen> createState() => _PomodoroScreenState();
}

class _PomodoroScreenState extends State<PomodoroScreen> {
  PomodoroMode _mode = PomodoroMode.focus;
  int _secondsRemaining = 25 * 60;
  bool _isRunning = false;
  Timer? _timer;
  int _completedSessions = 0;

  int get _totalSecondsForMode {
    switch (_mode) {
      case PomodoroMode.focus:
        return 25 * 60;
      case PomodoroMode.shortBreak:
        return 5 * 60;
      case PomodoroMode.longBreak:
        return 15 * 60;
    }
  }

  void _switchMode(PomodoroMode mode) {
    _timer?.cancel();
    setState(() {
      _mode = mode;
      _secondsRemaining = _totalSecondsForMode;
      _isRunning = false;
    });
  }

  void _toggleTimer() {
    if (_isRunning) {
      _timer?.cancel();
      setState(() => _isRunning = false);
    } else {
      setState(() => _isRunning = true);
      _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
        if (_secondsRemaining > 0) {
          setState(() => _secondsRemaining--);
        } else {
          _timer?.cancel();
          setState(() {
            _isRunning = false;
            if (_mode == PomodoroMode.focus) {
              _completedSessions++;
              context.read<AppState>().addXp(100, coins: 15);
              _switchMode(PomodoroMode.shortBreak);
            } else {
              _switchMode(PomodoroMode.focus);
            }
          });
        }
      });
    }
  }

  void _resetTimer() {
    _timer?.cancel();
    setState(() {
      _secondsRemaining = _totalSecondsForMode;
      _isRunning = false;
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final minutes = (_secondsRemaining ~/ 60).toString().padLeft(2, '0');
    final seconds = (_secondsRemaining % 60).toString().padLeft(2, '0');
    final progress = 1.0 - (_secondsRemaining / _totalSecondsForMode);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Pomodoro Focus Timer', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
      ),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Mode switcher
              Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: AppTheme.cardDark,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppTheme.borderDark),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    _buildModeChip('Focus (25m)', PomodoroMode.focus),
                    _buildModeChip('Short (5m)', PomodoroMode.shortBreak),
                    _buildModeChip('Long (15m)', PomodoroMode.longBreak),
                  ],
                ),
              ),
              const SizedBox(height: 48),

              // Circular Timer
              Stack(
                alignment: Alignment.center,
                children: [
                  SizedBox(
                    width: 240,
                    height: 240,
                    child: CircularProgressIndicator(
                      value: progress,
                      strokeWidth: 12,
                      backgroundColor: const Color(0xFF1E293B),
                      valueColor: AlwaysStoppedAnimation(
                        _mode == PomodoroMode.focus ? AppTheme.brandPrimary : AppTheme.brandBlue,
                      ),
                    ),
                  ),
                  Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        '$minutes:$seconds',
                        style: const TextStyle(
                          fontSize: 48,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                          letterSpacing: 2,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        _mode == PomodoroMode.focus ? 'Deep Study Interval' : 'Rest & Hydrate',
                        style: const TextStyle(fontSize: 12, color: Colors.white54),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 48),

              // Controls
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  IconButton(
                    iconSize: 32,
                    icon: const Icon(Icons.refresh_rounded, color: Colors.white54),
                    onPressed: _resetTimer,
                    tooltip: 'Reset',
                  ),
                  const SizedBox(width: 24),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.brandPrimary,
                      padding: const EdgeInsets.symmetric(horizontal: 36, vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    ),
                    onPressed: _toggleTimer,
                    child: Text(
                      _isRunning ? 'Pause Focus' : 'Start Focus',
                      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 36),

              // Session Stats
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                decoration: BoxDecoration(
                  color: AppTheme.cardDark,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppTheme.borderDark),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.check_circle_outline, color: AppTheme.brandAccent, size: 18),
                    const SizedBox(width: 8),
                    Text('Completed Sessions Today: $_completedSessions', style: const TextStyle(fontSize: 13, color: Colors.white70)),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildModeChip(String label, PomodoroMode mode) {
    final isSelected = _mode == mode;
    return GestureDetector(
      onTap: () => _switchMode(mode),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.brandPrimary : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 12,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
            color: isSelected ? Colors.white : Colors.white70,
          ),
        ),
      ),
    );
  }
}
