enum TaskPriority { high, medium, low }

class StudyTask {
  final String id;
  final String title;
  final String subject;
  final int durationMinutes;
  final TaskPriority priority;
  final bool isCompleted;
  final DateTime scheduledDate;

  StudyTask({
    required this.id,
    required this.title,
    required this.subject,
    required this.durationMinutes,
    this.priority = TaskPriority.medium,
    this.isCompleted = false,
    required this.scheduledDate,
  });

  StudyTask copyWith({
    String? id,
    String? title,
    String? subject,
    int? durationMinutes,
    TaskPriority? priority,
    bool? isCompleted,
    DateTime? scheduledDate,
  }) {
    return StudyTask(
      id: id ?? this.id,
      title: title ?? this.title,
      subject: subject ?? this.subject,
      durationMinutes: durationMinutes ?? this.durationMinutes,
      priority: priority ?? this.priority,
      isCompleted: isCompleted ?? this.isCompleted,
      scheduledDate: scheduledDate ?? this.scheduledDate,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'subject': subject,
    'durationMinutes': durationMinutes,
    'priority': priority.name,
    'isCompleted': isCompleted,
    'scheduledDate': scheduledDate.toIso8601String(),
  };

  factory StudyTask.fromJson(Map<String, dynamic> json) => StudyTask(
    id: json['id'] ?? '',
    title: json['title'] ?? '',
    subject: json['subject'] ?? 'General',
    durationMinutes: json['durationMinutes'] ?? 45,
    priority: TaskPriority.values.firstWhere(
      (p) => p.name == json['priority'],
      orElse: () => TaskPriority.medium,
    ),
    isCompleted: json['isCompleted'] ?? false,
    scheduledDate: DateTime.tryParse(json['scheduledDate'] ?? '') ?? DateTime.now(),
  );
}
