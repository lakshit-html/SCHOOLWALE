import 'package:flutter/material.dart';
import '../models/user_profile.dart';
import '../models/study_task.dart';
import '../models/ncert_book.dart';
import '../services/storage_service.dart';

class AppState extends ChangeNotifier {
  UserProfile _profile = UserProfile(
    name: 'Aspiring Scholar',
    grade: 'Class 12',
    targetExam: 'CBSE Board + JEE',
  );

  List<StudyTask> _tasks = [];
  bool _isLoading = true;
  NCERTChapter? _activeWhiteboardChapter;
  int _currentTabIndex = 0;

  AppState() {
    _initData();
  }

  UserProfile get profile => _profile;
  List<StudyTask> get tasks => _tasks;
  bool get isLoading => _isLoading;
  NCERTChapter? get activeWhiteboardChapter => _activeWhiteboardChapter;
  int get currentTabIndex => _currentTabIndex;

  Future<void> _initData() async {
    _profile = await StorageService.loadProfile();
    _tasks = await StorageService.loadTasks();
    _isLoading = false;
    notifyListeners();
  }

  void setTabIndex(int index) {
    _currentTabIndex = index;
    notifyListeners();
  }

  void updateProfile(UserProfile newProfile) {
    _profile = newProfile;
    StorageService.saveProfile(_profile);
    notifyListeners();
  }

  void addXp(int amount, {int coins = 0}) {
    final nextXp = _profile.xp + amount;
    final nextCoins = _profile.coins + coins;
    final nextLevel = 1 + (nextXp ~/ 500);

    _profile = _profile.copyWith(
      xp: nextXp,
      coins: nextCoins,
      level: nextLevel,
    );
    StorageService.saveProfile(_profile);
    notifyListeners();
  }

  void toggleTask(String id) {
    _tasks = _tasks.map((t) {
      if (t.id == id) {
        final toggled = !t.isCompleted;
        if (toggled) addXp(50, coins: 10);
        return t.copyWith(isCompleted: toggled);
      }
      return t;
    }).toList();
    StorageService.saveTasks(_tasks);
    notifyListeners();
  }

  void addTask(StudyTask task) {
    _tasks.insert(0, task);
    StorageService.saveTasks(_tasks);
    notifyListeners();
  }

  void deleteTask(String id) {
    _tasks.removeWhere((t) => t.id == id);
    StorageService.saveTasks(_tasks);
    notifyListeners();
  }

  void setWhiteboardChapter(NCERTChapter? chapter) {
    _activeWhiteboardChapter = chapter;
    if (chapter != null) {
      // Jump to Whiteboard tab (index 3)
      _currentTabIndex = 3;
    }
    notifyListeners();
  }

  void clearWhiteboardChapter() {
    _activeWhiteboardChapter = null;
    notifyListeners();
  }
}
