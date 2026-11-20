class QuizQuestion {
  final String id;
  final String question;
  final List<String> options;
  final int correctAnswer;
  final String explanation;
  final String subject;
  final String difficulty;
  final String topic;

  QuizQuestion({
    required this.id,
    required this.question,
    required this.options,
    required this.correctAnswer,
    required this.explanation,
    required this.subject,
    this.difficulty = 'medium',
    required this.topic,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'question': question,
    'options': options,
    'correctAnswer': correctAnswer,
    'explanation': explanation,
    'subject': subject,
    'difficulty': difficulty,
    'topic': topic,
  };

  factory QuizQuestion.fromJson(Map<String, dynamic> json) => QuizQuestion(
    id: json['id'] ?? 'q_${DateTime.now().millisecondsSinceEpoch}',
    question: json['question'] ?? '',
    options: List<String>.from(json['options'] ?? []),
    correctAnswer: json['correctAnswer'] ?? 0,
    explanation: json['explanation'] ?? '',
    subject: json['subject'] ?? 'General',
    difficulty: json['difficulty'] ?? 'medium',
    topic: json['topic'] ?? 'General Concept',
  );
}
