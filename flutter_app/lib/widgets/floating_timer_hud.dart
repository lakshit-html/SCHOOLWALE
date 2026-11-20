import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../theme/app_theme.dart';

class FloatingTimerHUD extends StatefulWidget {
  const FloatingTimerHUD({Key? key}) : super(key: key);

  @override
  State<FloatingTimerHUD> createState() => _FloatingTimerHUDState();
}

class _FloatingTimerHUDState extends State<FloatingTimerHUD> with SingleTickerProviderStateMixin {
  Offset? _position;
  late AnimationController _pulseController;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 1),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();

    // Only display HUD if timer is active or running, and we are not on the Pomodoro tab (tab index 4)
    if (!appState.isTimerRunning && appState.timerRemainingSeconds == appState.totalSecondsForCurrentMode) {
      return const SizedBox.shrink();
    }
    if (appState.currentTabIndex == 4) {
      return const SizedBox.shrink();
    }

    final topPadding = MediaQuery.of(context).padding.top;
    final defaultOffset = Offset(
      MediaQuery.of(context).size.width - 156,
      topPadding + 10,
    );
    final pos = _position ?? defaultOffset;

    final isFocus = appState.timerMode == PomodoroMode.focus;
    final color = isFocus ? AppTheme.brandPrimary : AppTheme.brandBlue;

    return Positioned(
      left: pos.dx,
      top: pos.dy,
      child: GestureDetector(
        onPanUpdate: (details) {
          setState(() {
            _position = Offset(
              (pos.dx + details.delta.dx).clamp(10.0, MediaQuery.of(context).size.width - 160.0),
              (pos.dy + details.delta.dy).clamp(topPadding, MediaQuery.of(context).size.height - 120.0),
            );
          });
        },
        onTap: () {
          // Switch directly to Pomodoro Focus tab
          appState.setTabIndex(4);
        },
        child: Material(
          elevation: 8,
          borderRadius: BorderRadius.circular(24),
          color: Colors.transparent,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: AppTheme.cardDark.withOpacity(0.95),
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: color.withOpacity(0.6), width: 1.5),
              boxShadow: [
                BoxShadow(
                  color: color.withOpacity(0.3),
                  blurRadius: 10,
                  spreadRadius: 1,
                ),
              ],
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Pulsing status dot
                FadeTransition(
                  opacity: appState.isTimerRunning ? _pulseController : const AlwaysStoppedAnimation(1.0),
                  child: Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: appState.isTimerRunning ? color : Colors.white38,
                      shape: BoxShape.circle,
                    ),
                  ),
                ),
                const SizedBox(width: 8),

                // Formatted Time
                Text(
                  appState.formattedTimer,
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                  ),
                ),
                const SizedBox(width: 6),

                // Quick Play/Pause Button
                InkWell(
                  onTap: () => appState.toggleTimer(),
                  borderRadius: BorderRadius.circular(12),
                  child: Padding(
                    padding: const EdgeInsets.all(2),
                    child: Icon(
                      appState.isTimerRunning ? Icons.pause_circle_filled : Icons.play_circle_fill,
                      color: color,
                      size: 20,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
