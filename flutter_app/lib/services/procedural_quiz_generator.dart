import 'dart:math';
import '../models/quiz_question.dart';

class ProceduralQuizGenerator {
  static final Random _rng = Random();

  static int _randInt(int min, int max) => min + _rng.nextInt(max - min + 1);

  static List<T> _shuffle<T>(List<T> list) {
    final copy = List<T>.from(list);
    for (int i = copy.length - 1; i > 0; i--) {
      final j = _rng.nextInt(i + 1);
      final tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  static List<QuizQuestion> generateDynamicQuestions(String grade, {int count = 5}) {
    final list = <QuizQuestion>[];

    // 1. Kinematics (v = u + at)
    final u = _randInt(0, 15);
    final a = _randInt(2, 6);
    final t = _randInt(2, 8);
    final v = u + a * t;
    list.add(QuizQuestion(
      id: 'dyn_kin_${DateTime.now().millisecondsSinceEpoch}_1',
      question: 'A particle moves with initial velocity u = $u m/s and uniform acceleration a = $a m/s² for t = $t s. What is its final velocity v?',
      options: ['$v m/s', '${v + 4} m/s', '${v - 3} m/s', '${v + 8} m/s'],
      correctAnswer: 0,
      explanation: 'Using v = u + at = $u + ($a)($t) = $v m/s.',
      subject: 'Physics',
      topic: 'Motion in a Straight Line',
    ));

    // 2. Ohm\'s Law & Power (P = V^2 / R)
    final vOhm = _randInt(10, 40) * 2;
    final rOhm = _randInt(2, 8);
    final pOhm = (vOhm * vOhm) ~/ rOhm;
    list.add(QuizQuestion(
      id: 'dyn_ohm_${DateTime.now().millisecondsSinceEpoch}_2',
      question: 'A resistor R = $rOhm Ω is connected across potential difference V = $vOhm V. Calculate the electrical power dissipated.',
      options: ['$pOhm W', '${pOhm + 25} W', '${max(10, pOhm - 20)} W', '${(pOhm * 1.5).round()} W'],
      correctAnswer: 0,
      explanation: 'P = V² / R = ($vOhm)² / $rOhm = $pOhm W.',
      subject: 'Physics',
      topic: 'Current Electricity',
    ));

    // 3. Molar mass (n = mass / 18)
    final moles = _randInt(2, 5);
    final massH2O = moles * 18;
    list.add(QuizQuestion(
      id: 'dyn_mol_${DateTime.now().millisecondsSinceEpoch}_3',
      question: 'How many moles of water (H₂O, molar mass = 18 g/mol) are present in $massH2O g of pure water?',
      options: ['$moles moles', '${moles + 1} moles', '${moles - 1} moles', '${moles * 2} moles'],
      correctAnswer: 0,
      explanation: 'Moles n = mass / molar mass = $massH2O / 18 = $moles moles.',
      subject: 'Chemistry',
      topic: 'Basic Concepts of Chemistry',
    ));

    // 4. Matrix Determinant 2x2
    final mA = _randInt(2, 7);
    final mB = _randInt(1, 4);
    final mC = _randInt(1, 5);
    final mD = _randInt(3, 8);
    final det = mA * mD - mB * mC;
    list.add(QuizQuestion(
      id: 'dyn_mat_${DateTime.now().millisecondsSinceEpoch}_4',
      question: 'Find the determinant of the 2x2 matrix [[$mA, $mB], [$mC, $mD]].',
      options: ['$det', '${det + 3}', '${det - 4}', '${det * 2}'],
      correctAnswer: 0,
      explanation: 'det = (a·d - b·c) = ($mA · $mD) - ($mB · $mC) = ${mA * mD} - ${mB * mC} = $det.',
      subject: 'Mathematics',
      topic: 'Determinants',
    ));

    // 5. Half life radioactivity
    final tHalf = _randInt(3, 8) * 5;
    const nHalf = 3;
    final totalT = tHalf * nHalf;
    list.add(QuizQuestion(
      id: 'dyn_rad_${DateTime.now().millisecondsSinceEpoch}_5',
      question: 'A radioactive isotope has a half-life of $tHalf minutes. What percentage remains after $totalT minutes?',
      options: ['12.5%', '25%', '6.25%', '50%'],
      correctAnswer: 0,
      explanation: 'n = $totalT / $tHalf = 3 half-lives. Remaining = (1/2)³ · 100% = 12.5%.',
      subject: 'Chemistry',
      topic: 'Chemical Kinetics',
    ));

    // Randomize choices so correctAnswer is not always 0
    final shuffled = list.map((q) {
      final indices = [0, 1, 2, 3];
      final shuffledIndices = _shuffle(indices);
      final newOptions = shuffledIndices.map((idx) => q.options[idx]).toList();
      final newCorrect = shuffledIndices.indexOf(0);
      return QuizQuestion(
        id: q.id,
        question: q.question,
        options: newOptions,
        correctAnswer: newCorrect,
        explanation: q.explanation,
        subject: q.subject,
        difficulty: q.difficulty,
        topic: q.topic,
      );
    }).toList();

    return _shuffle(shuffled).take(count).toList();
  }
}
