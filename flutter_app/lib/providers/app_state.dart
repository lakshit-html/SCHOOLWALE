import 'dart:async';
import 'package:flutter/material.dart';
import '../models/user_profile.dart';
import '../models/study_task.dart';
import '../models/ncert_book.dart';
import '../services/storage_service.dart';
import '../theme/app_theme.dart';

enum PomodoroMode { focus, shortBreak, longBreak }

class AppState extends ChangeNotifier {
  UserProfile _profile = UserProfile(
    name: '',
    grade: 'Class 12',
    targetExam: 'CBSE Board + JEE',
    isLoggedIn: false,
    hasCompletedOnboarding: false,
  );

  List<StudyTask> _tasks = [];
  bool _isLoading = true;
  NCERTChapter? _activeWhiteboardChapter;
  AppThemeMode _themeMode = AppThemeMode.dark;
  int _currentTabIndex = 0;

  // Persistent Timer Engine
  PomodoroMode _timerMode = PomodoroMode.focus;
  int _timerRemainingSeconds = 25 * 60;
  bool _isTimerRunning = false;
  DateTime? _timerTargetEndTime;
  int _timerCompletedSessions = 0;
  Timer? _ticker;

  AppState() {
    _initData();
  }

  UserProfile get profile => _profile;
  List<StudyTask> get tasks => _tasks;
  bool get isLoading => _isLoading;
  NCERTChapter? get activeWhiteboardChapter => _activeWhiteboardChapter;
  int get currentTabIndex => _currentTabIndex;
  AppThemeMode get themeMode => _themeMode;
  bool get isMonochromeMode => _themeMode == AppThemeMode.monochrome;

  void setThemeMode(AppThemeMode mode) {
    _themeMode = mode;
    StorageService.saveThemeMode(_themeMode);
    notifyListeners();
  }

  void toggleThemeMode() {
    if (_themeMode == AppThemeMode.dark) {
      setThemeMode(AppThemeMode.light);
    } else if (_themeMode == AppThemeMode.light) {
      setThemeMode(AppThemeMode.monochrome);
    } else {
      setThemeMode(AppThemeMode.dark);
    }
  }

  void toggleMonochromeMode() {
    toggleThemeMode();
  }

  // Timer Getters
  PomodoroMode get timerMode => _timerMode;
  int get timerRemainingSeconds => _timerRemainingSeconds;
  bool get isTimerRunning => _isTimerRunning;
  int get timerCompletedSessions => _timerCompletedSessions;

  int get totalSecondsForCurrentMode {
    switch (_timerMode) {
      case PomodoroMode.focus:
        return 25 * 60;
      case PomodoroMode.shortBreak:
        return 5 * 60;
      case PomodoroMode.longBreak:
        return 15 * 60;
    }
  }

  double get timerProgress {
    final total = totalSecondsForCurrentMode;
    if (total == 0) return 0.0;
    return (1.0 - (_timerRemainingSeconds / total)).clamp(0.0, 1.0);
  }

  String get formattedTimer {
    final m = (_timerRemainingSeconds ~/ 60).toString().padLeft(2, '0');
    final s = (_timerRemainingSeconds % 60).toString().padLeft(2, '0');
    return '$m:$s';
  }

  Future<void> _initData() async {
    _profile = await StorageService.loadProfile();
    _tasks = await StorageService.loadTasks();
    _themeMode = await StorageService.loadThemeMode();

    // Restore persistent timer state
    final savedTimer = await StorageService.loadTimerState();
    _timerMode = PomodoroMode.values[savedTimer.modeIndex.clamp(0, 2)];
    _timerCompletedSessions = savedTimer.completedSessions;

    if (savedTimer.isRunning && savedTimer.targetEndTimeMs != null) {
      final target = DateTime.fromMillisecondsSinceEpoch(savedTimer.targetEndTimeMs!);
      final diff = target.difference(DateTime.now()).inSeconds;
      if (diff > 0) {
        _timerRemainingSeconds = diff;
        _timerTargetEndTime = target;
        _isTimerRunning = true;
        _startTicker();
      } else {
        _timerRemainingSeconds = totalSecondsForCurrentMode;
        _isTimerRunning = false;
        _timerTargetEndTime = null;
      }
    } else {
      _timerRemainingSeconds = savedTimer.remainingSeconds;
      _isTimerRunning = false;
    }

    _isLoading = false;
    notifyListeners();
  }

  void setTabIndex(int index) {
    _currentTabIndex = index;
    notifyListeners();
  }

  // --- Timer Actions ---
  void _startTicker() {
    _ticker?.cancel();
    _ticker = Timer.periodic(const Duration(seconds: 1), (_) {
      _reconcileTimer();
    });
  }

  void _reconcileTimer() {
    if (!_isTimerRunning || _timerTargetEndTime == null) return;

    final diff = _timerTargetEndTime!.difference(DateTime.now()).inSeconds;
    if (diff > 0) {
      _timerRemainingSeconds = diff;
      notifyListeners();
    } else {
      _onTimerCompleted();
    }
  }

  void _onTimerCompleted() {
    _ticker?.cancel();
    _isTimerRunning = false;
    _timerTargetEndTime = null;

    if (_timerMode == PomodoroMode.focus) {
      _timerCompletedSessions++;
      addXp(100, coins: 20);
      setTimerMode(PomodoroMode.shortBreak);
    } else {
      setTimerMode(PomodoroMode.focus);
    }
    _persistTimer();
    notifyListeners();
  }

  void toggleTimer() {
    if (_isTimerRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  }

  void startTimer() {
    _isTimerRunning = true;
    _timerTargetEndTime = DateTime.now().add(Duration(seconds: _timerRemainingSeconds));
    _startTicker();
    _persistTimer();
    notifyListeners();
  }

  void pauseTimer() {
    _isTimerRunning = false;
    _ticker?.cancel();
    if (_timerTargetEndTime != null) {
      _timerRemainingSeconds = _timerTargetEndTime!.difference(DateTime.now()).inSeconds.clamp(0, 7200);
      _timerTargetEndTime = null;
    }
    _persistTimer();
    notifyListeners();
  }

  void resetTimer() {
    _ticker?.cancel();
    _isTimerRunning = false;
    _timerTargetEndTime = null;
    _timerRemainingSeconds = totalSecondsForCurrentMode;
    _persistTimer();
    notifyListeners();
  }

  void setTimerMode(PomodoroMode mode) {
    _ticker?.cancel();
    _timerMode = mode;
    _isTimerRunning = false;
    _timerTargetEndTime = null;
    _timerRemainingSeconds = totalSecondsForCurrentMode;
    _persistTimer();
    notifyListeners();
  }

  void reconcileAppResumed() {
    if (_isTimerRunning && _timerTargetEndTime != null) {
      _reconcileTimer();
    }
  }

  void _persistTimer() {
    StorageService.saveTimerState(
      TimerSavedState(
        modeIndex: _timerMode.index,
        remainingSeconds: _timerRemainingSeconds,
        isRunning: _isTimerRunning,
        targetEndTimeMs: _timerTargetEndTime?.millisecondsSinceEpoch,
        completedSessions: _timerCompletedSessions,
      ),
    );
  }

  // --- Profile & Tasks ---
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
      _currentTabIndex = 3;
    }
    notifyListeners();
  }

  void clearWhiteboardChapter() {
    _activeWhiteboardChapter = null;
    notifyListeners();
  }

  // --- Database Management ---
  Future<String> exportDatabaseJson() async {
    return await StorageService.exportFullDatabaseJson();
  }

  Future<bool> importDatabaseJson(String jsonStr) async {
    final success = await StorageService.importFullDatabaseJson(jsonStr);
    if (success) {
      await _initData();
    }
    return success;
  }

  Future<void> resetDatabase() async {
    await StorageService.resetDatabaseToDefaults();
    resetTimer();
    await _initData();
  }

  @override
  void dispose() {
    _ticker?.cancel();
    super.dispose();
  }
}
