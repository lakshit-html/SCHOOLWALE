import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user_profile.dart';
import '../models/study_task.dart';

class StorageService {
  static const String _keyProfile = 'studyforge_profile';
  static const String _keyTasks = 'studyforge_tasks';

  static Future<UserProfile> loadProfile() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonStr = prefs.getString(_keyProfile);
    if (jsonStr != null) {
      try {
        return UserProfile.fromJson(jsonDecode(jsonStr));
      } catch (_) {}
    }
    return UserProfile(name: 'Aspiring Scholar', grade: 'Class 12', targetExam: 'CBSE + JEE/NEET');
  }

  static Future<void> saveProfile(UserProfile profile) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyProfile, jsonEncode(profile.toJson()));
  }

  static Future<List<StudyTask>> loadTasks() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonStr = prefs.getString(_keyTasks);
    if (jsonStr != null) {
      try {
        final list = jsonDecode(jsonStr) as List;
        return list.map((item) => StudyTask.fromJson(item)).toList();
      } catch (_) {}
    }

    // Default starter tasks
    return [
      StudyTask(
        id: 'task_1',
        title: 'Revise Gauss Law & Electric Dipole Derivations',
        subject: 'Physics',
        durationMinutes: 45,
        priority: TaskPriority.high,
        isCompleted: false,
        scheduledDate: DateTime.now(),
      ),
      StudyTask(
        id: 'task_2',
        title: 'Solve NCERT In-Text Numericals on Solutions',
        subject: 'Chemistry',
        durationMinutes: 40,
        priority: TaskPriority.medium,
        isCompleted: false,
        scheduledDate: DateTime.now(),
      ),
      StudyTask(
        id: 'task_3',
        title: 'Practice Matrix Inversion & Cramer\'s Rule',
        subject: 'Mathematics',
        durationMinutes: 50,
        priority: TaskPriority.high,
        isCompleted: true,
        scheduledDate: DateTime.now(),
      ),
    ];
  }

  static Future<void> saveTasks(List<StudyTask> tasks) async {
    final prefs = await SharedPreferences.getInstance();
    final list = tasks.map((t) => t.toJson()).toList();
    await prefs.setString(_keyTasks, jsonEncode(list));
  }
}
