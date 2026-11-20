class UserProfile {
  final String name;
  final String grade;
  final String targetExam;
  final int xp;
  final int level;
  final int coins;
  final int currentStreak;
  final int studyHoursGoal;

  UserProfile({
    required this.name,
    required this.grade,
    required this.targetExam,
    this.xp = 1450,
    this.level = 4,
    this.coins = 240,
    this.currentStreak = 7,
    this.studyHoursGoal = 6,
  });

  UserProfile copyWith({
    String? name,
    String? grade,
    String? targetExam,
    int? xp,
    int? level,
    int? coins,
    int? currentStreak,
    int? studyHoursGoal,
  }) {
    return UserProfile(
      name: name ?? this.name,
      grade: grade ?? this.grade,
      targetExam: targetExam ?? this.targetExam,
      xp: xp ?? this.xp,
      level: level ?? this.level,
      coins: coins ?? this.coins,
      currentStreak: currentStreak ?? this.currentStreak,
      studyHoursGoal: studyHoursGoal ?? this.studyHoursGoal,
    );
  }

  Map<String, dynamic> toJson() => {
    'name': name,
    'grade': grade,
    'targetExam': targetExam,
    'xp': xp,
    'level': level,
    'coins': coins,
    'currentStreak': currentStreak,
    'studyHoursGoal': studyHoursGoal,
  };

  factory UserProfile.fromJson(Map<String, dynamic> json) => UserProfile(
    name: json['name'] ?? 'Aspiring Scholar',
    grade: json['grade'] ?? 'Class 12',
    targetExam: json['targetExam'] ?? 'CBSE Board + JEE',
    xp: json['xp'] ?? 1450,
    level: json['level'] ?? 4,
    coins: json['coins'] ?? 240,
    currentStreak: json['currentStreak'] ?? 7,
    studyHoursGoal: json['studyHoursGoal'] ?? 6,
  );
}
