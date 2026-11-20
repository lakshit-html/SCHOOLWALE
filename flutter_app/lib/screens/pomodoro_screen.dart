import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../theme/app_theme.dart';

class PomodoroScreen extends StatefulWidget {
  const PomodoroScreen({Key? key}) : super(key: key);

  @override
  State<PomodoroScreen> createState() => _PomodoroScreenState();
}

class _PomodoroScreenState extends State<PomodoroScreen> {
  String _selectedAmbient = 'Deep Focus Silence';

  final List<String> _ambientOptions = [
    'Deep Focus Silence',
    'Rain & Thunder',
    'Library Ambiance',
    'Lo-Fi Study Waves',
  ];

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final mode = appState.timerMode;
    final isRunning = appState.isTimerRunning;
    final formattedTime = appState.formattedTimer;
    final progress = appState.timerProgress;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Pomodoro Focus Engine', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: Colors.white70),
            tooltip: 'Reset Timer',
            onPressed: () => appState.resetTimer(),
          ),
        ],
      ),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
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
                    _buildModeChip('Focus (25m)', PomodoroMode.focus, mode, appState),
                    _buildModeChip('Short (5m)', PomodoroMode.shortBreak, mode, appState),
                    _buildModeChip('Long (15m)', PomodoroMode.longBreak, mode, appState),
                  ],
                ),
              ),
              const SizedBox(height: 36),

              // Circular Persistent Timer Display
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
                        mode == PomodoroMode.focus ? AppTheme.brandPrimary : AppTheme.brandBlue,
                      ),
                    ),
                  ),
                  Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        formattedTime,
                        style: const TextStyle(
                          fontSize: 48,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                          letterSpacing: 2,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        mode == PomodoroMode.focus ? 'Deep Study Interval' : 'Rest & Hydrate',
                        style: const TextStyle(fontSize: 12, color: Colors.white54),
                      ),
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: isRunning ? AppTheme.brandGreen.withOpacity(0.15) : Colors.white10,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          isRunning ? '● ACTIVE (PERSISTENT)' : 'PAUSED',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: isRunning ? AppTheme.brandGreen : Colors.white54,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 36),

              // Controls Row
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  IconButton(
                    onPressed: () => appState.resetTimer(),
                    icon: const Icon(Icons.replay, color: Colors.white70),
                    iconSize: 28,
                    tooltip: 'Reset',
                  ),
                  const SizedBox(width: 24),
                  ElevatedButton(
                    onPressed: () => appState.toggleTimer(),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: mode == PomodoroMode.focus ? AppTheme.brandPrimary : AppTheme.brandBlue,
                      padding: const EdgeInsets.symmetric(horizontal: 36, vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                      elevation: 8,
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(isRunning ? Icons.pause : Icons.play_arrow, color: Colors.white),
                        const SizedBox(width: 8),
                        Text(
                          isRunning ? 'PAUSE' : 'START FOCUS',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.white),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 24),
                  IconButton(
                    onPressed: () {
                      if (mode == PomodoroMode.focus) {
                        appState.setTimerMode(PomodoroMode.shortBreak);
                      } else {
                        appState.setTimerMode(PomodoroMode.focus);
                      }
                    },
                    icon: const Icon(Icons.skip_next, color: Colors.white70),
                    iconSize: 28,
                    tooltip: 'Skip Interval',
                  ),
                ],
              ),
              const SizedBox(height: 28),

              // Persistent Background Notice
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.cardDark,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppTheme.borderDark),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.shield_outlined, color: AppTheme.brandGreen, size: 20),
                    SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        'Persistent Engine: Switching tabs, reading NCERT, using Whiteboard, or minimizing the app will NOT reset this timer.',
                        style: TextStyle(color: Colors.white70, fontSize: 11),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Ambient Sound Selector
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  color: AppTheme.cardDark,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppTheme.borderDark),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.headphones, color: AppTheme.brandBlue, size: 20),
                    const SizedBox(width: 12),
                    Expanded(
                      child: DropdownButton<String>(
                        value: _selectedAmbient,
                        isExpanded: true,
                        underline: const SizedBox(),
                        dropdownColor: AppTheme.cardDark,
                        items: _ambientOptions.map((opt) => DropdownMenuItem(
                          value: opt,
                          child: Text(opt, style: const TextStyle(color: Colors.white, fontSize: 13)),
                        )).toList(),
                        onChanged: (val) {
                          if (val != null) setState(() => _selectedAmbient = val);
                        },
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildModeChip(String label, PomodoroMode mode, PomodoroMode currentMode, AppState appState) {
    final isSelected = currentMode == mode;
    return GestureDetector(
      onTap: () => appState.setTimerMode(mode),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.brandPrimary : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? Colors.white : Colors.white60,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
            fontSize: 12,
          ),
        ),
      ),
    );
  }
}
