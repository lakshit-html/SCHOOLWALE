import 'dart:math';
import 'package:flutter/material.dart';

class CrazyNotification {
  final String title;
  final String body;
  final String tag;
  final IconData icon;
  final Color color;

  CrazyNotification({
    required this.title,
    required this.body,
    required this.tag,
    required this.icon,
    required this.color,
  });
}

class CrazyNotificationService {
  static final List<CrazyNotification> _alerts = [
    CrazyNotification(
      title: '🔥 STREAK DANGER!',
      body: 'Your study consistency streak is about to die! Just 15 minutes of Pomodoro focus keeps your flame burning!',
      tag: 'Streak Defense',
      icon: Icons.local_fire_department,
      color: Colors.orange,
    ),
    CrazyNotification(
      title: '⚡ PEAK ALPHA WAVE INCOMING!',
      body: 'Cognitive scientists verify that your brain is in prime memory retention right now. Open your high-priority backlog!',
      tag: 'Neuro Focus',
      icon: Icons.bolt,
      color: Colors.amber,
    ),
    CrazyNotification(
      title: '🧠 FORGETTING CURVE WARNING!',
      body: '3 key formula derivations are rapidly slipping from your synaptic memory today! Launch Spaced Repetition now!',
      tag: 'Memory Shield',
      icon: Icons.psychology,
      color: Colors.cyan,
    ),
    CrazyNotification(
      title: '⚔️ ARENA BOSS SPAWNED!',
      body: 'A timed NCERT speed battle has unlocked in the Study Arena! Solve 5 rapid problems & pocket +150 XP!',
      tag: 'Arena Challenge',
      icon: Icons.sports_esports,
      color: Colors.purpleAccent,
    ),
    CrazyNotification(
      title: '🎯 DAILY TARGET CRUSH!',
      body: 'You are so close to conquering your daily study hours! Push for one final 25-minute sprint and sleep like a topper!',
      tag: 'Target Sprint',
      icon: Icons.track_changes,
      color: const Color(0xFF10B981),
    ),
    CrazyNotification(
      title: '📖 NCERT DERIVATION MASTERY',
      body: 'Did you revise Gauss Law & King\'s Property today? Check the formula sheets vault before calling it a day!',
      tag: 'NCERT Recall',
      icon: Icons.menu_book,
      color: Colors.lightBlueAccent,
    ),
  ];

  static CrazyNotification getRandomAlert() {
    final rand = Random();
    return _alerts[rand.nextInt(_alerts.length)];
  }

  static void showCrazyNotification(BuildContext context, {CrazyNotification? specificAlert}) {
    final alert = specificAlert ?? getRandomAlert();

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        behavior: SnackBarBehavior.floating,
        backgroundColor: const Color(0xFF1E1B4B),
        elevation: 10,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide(color: alert.color.withOpacity(0.6), width: 1.5),
        ),
        duration: const Duration(seconds: 5),
        content: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: alert.color.withOpacity(0.2),
                shape: BoxShape.circle,
              ),
              child: Icon(alert.icon, color: alert.color, size: 24),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        alert.title,
                        style: TextStyle(
                          color: alert.color,
                          fontWeight: FontWeight.bold,
                          fontSize: 13,
                          letterSpacing: 0.5,
                        ),
                      ),
                      const Spacer(),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: Colors.white12,
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          alert.tag,
                          style: const TextStyle(fontSize: 9, color: Colors.white70),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    alert.body,
                    style: const TextStyle(color: Colors.white, fontSize: 12, height: 1.3),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
