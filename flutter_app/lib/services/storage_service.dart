import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user_profile.dart';
import '../models/study_task.dart';
import '../theme/app_theme.dart';

class TimerSavedState {
  final int modeIndex;
  final int remainingSeconds;
  final bool isRunning;
  final int? targetEndTimeMs;
  final int completedSessions;

  TimerSavedState({
    required this.modeIndex,
    required this.remainingSeconds,
    required this.isRunning,
    this.targetEndTimeMs,
    required this.completedSessions,
  });

  Map<String, dynamic> toJson() => {
    'modeIndex': modeIndex,
    'remainingSeconds': remainingSeconds,
    'isRunning': isRunning,
    'targetEndTimeMs': targetEndTimeMs,
    'completedSessions': completedSessions,
  };

  factory TimerSavedState.fromJson(Map<String, dynamic> json) => TimerSavedState(
    modeIndex: json['modeIndex'] ?? 0,
    remainingSeconds: json['remainingSeconds'] ?? (25 * 60),
    isRunning: json['isRunning'] ?? false,
    targetEndTimeMs: json['targetEndTimeMs'],
    completedSessions: json['completedSessions'] ?? 0,
  );
}

class StorageService {
  static const String _keyProfile = 'studyforge_profile';
  static const String _keyTasks = 'studyforge_tasks';
  static const String _keyTimer = 'studyforge_timer';
  static const String _keyThemeMode = 'studyforge_theme_mode';

  // Theme Mode
  static Future<AppThemeMode> loadThemeMode() async {
    final prefs = await SharedPreferences.getInstance();
    final idx = prefs.getInt(_keyThemeMode);
    if (idx != null && idx >= 0 && idx < AppThemeMode.values.length) {
      return AppThemeMode.values[idx];
    }
    return AppThemeMode.dark;
  }

  static Future<void> saveThemeMode(AppThemeMode mode) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt(_keyThemeMode, mode.index);
  }

  // Profile operations
  static Future<UserProfile> loadProfile() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonStr = prefs.getString(_keyProfile);
    if (jsonStr != null) {
      try {
        return UserProfile.fromJson(jsonDecode(jsonStr));
      } catch (_) {}
    }
    return UserProfile(
      name: '',
      grade: 'Class 12',
      targetExam: 'CBSE Board + JEE',
      isLoggedIn: false,
      hasCompletedOnboarding: false,
    );
  }

  static Future<void> saveProfile(UserProfile profile) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyProfile, jsonEncode(profile.toJson()));
  }

  // Task operations - 100% Fresh Start (No Example / Dummy Data)
  static Future<List<StudyTask>> loadTasks() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonStr = prefs.getString(_keyTasks);
    if (jsonStr != null) {
      try {
        final list = jsonDecode(jsonStr) as List;
        return list.map((item) => StudyTask.fromJson(item)).toList();
      } catch (_) {}
    }
    return []; // Clean empty start!
  }

  static Future<void> saveTasks(List<StudyTask> tasks) async {
    final prefs = await SharedPreferences.getInstance();
    final list = tasks.map((t) => t.toJson()).toList();
    await prefs.setString(_keyTasks, jsonEncode(list));
  }

  // Persistent Timer operations
  static Future<TimerSavedState> loadTimerState() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonStr = prefs.getString(_keyTimer);
    if (jsonStr != null) {
      try {
        return TimerSavedState.fromJson(jsonDecode(jsonStr));
      } catch (_) {}
    }
    return TimerSavedState(
      modeIndex: 0,
      remainingSeconds: 25 * 60,
      isRunning: false,
      completedSessions: 0,
    );
  }

  static Future<void> saveTimerState(TimerSavedState state) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyTimer, jsonEncode(state.toJson()));
  }

  // Full Database Vault operations
  static Future<String> exportFullDatabaseJson() async {
    final profile = await loadProfile();
    final tasks = await loadTasks();
    final timer = await loadTimerState();

    final data = {
      'version': '2.0.0',
      'exportedAt': DateTime.now().toIso8601String(),
      'profile': profile.toJson(),
      'tasks': tasks.map((t) => t.toJson()).toList(),
      'timer': timer.toJson(),
    };
    return const JsonEncoder.withIndent('  ').convert(data);
  }

  static Future<bool> importFullDatabaseJson(String jsonString) async {
    try {
      final data = jsonDecode(jsonString) as Map<String, dynamic>;
      if (data.containsKey('profile')) {
        final profile = UserProfile.fromJson(data['profile']);
        await saveProfile(profile);
      }
      if (data.containsKey('tasks')) {
        final list = (data['tasks'] as List).map((t) => StudyTask.fromJson(t)).toList();
        await saveTasks(list);
      }
      return true;
    } catch (_) {
      return false;
    }
  }

  static Future<void> resetDatabaseToDefaults() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }
}
