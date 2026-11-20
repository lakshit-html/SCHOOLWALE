class UserProfile {
  final String name;
  final String email;
  final String grade;
  final String targetExam;
  final int xp;
  final int level;
  final int coins;
  final int currentStreak;
  final int studyHoursGoal;
  final bool isLoggedIn;
  final bool hasCompletedOnboarding;

  UserProfile({
    required this.name,
    this.email = '',
    required this.grade,
    required this.targetExam,
    this.xp = 0,
    this.level = 1,
    this.coins = 50,
    this.currentStreak = 1,
    this.studyHoursGoal = 6,
    this.isLoggedIn = false,
    this.hasCompletedOnboarding = false,
  });

  UserProfile copyWith({
    String? name,
    String? email,
    String? grade,
    String? targetExam,
    int? xp,
    int? level,
    int? coins,
    int? currentStreak,
    int? studyHoursGoal,
    bool? isLoggedIn,
    bool? hasCompletedOnboarding,
  }) {
    return UserProfile(
      name: name ?? this.name,
      email: email ?? this.email,
      grade: grade ?? this.grade,
      targetExam: targetExam ?? this.targetExam,
      xp: xp ?? this.xp,
      level: level ?? this.level,
      coins: coins ?? this.coins,
      currentStreak: currentStreak ?? this.currentStreak,
      studyHoursGoal: studyHoursGoal ?? this.studyHoursGoal,
      isLoggedIn: isLoggedIn ?? this.isLoggedIn,
      hasCompletedOnboarding: hasCompletedOnboarding ?? this.hasCompletedOnboarding,
    );
  }

  Map<String, dynamic> toJson() => {
    'name': name,
    'email': email,
    'grade': grade,
    'targetExam': targetExam,
    'xp': xp,
    'level': level,
    'coins': coins,
    'currentStreak': currentStreak,
    'studyHoursGoal': studyHoursGoal,
    'isLoggedIn': isLoggedIn,
    'hasCompletedOnboarding': hasCompletedOnboarding,
  };

  factory UserProfile.fromJson(Map<String, dynamic> json) => UserProfile(
    name: json['name'] ?? '',
    email: json['email'] ?? '',
    grade: json['grade'] ?? 'Class 12',
    targetExam: json['targetExam'] ?? 'CBSE Board + JEE',
    xp: json['xp'] ?? 0,
    level: json['level'] ?? 1,
    coins: json['coins'] ?? 50,
    currentStreak: json['currentStreak'] ?? 1,
    studyHoursGoal: json['studyHoursGoal'] ?? 6,
    isLoggedIn: json['isLoggedIn'] ?? false,
    hasCompletedOnboarding: json['hasCompletedOnboarding'] ?? false,
  );
}
