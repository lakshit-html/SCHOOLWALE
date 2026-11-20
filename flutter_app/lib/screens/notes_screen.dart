import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../models/ncert_book.dart';
import '../theme/app_theme.dart';

class NoteTopic {
  final String id;
  final String subject;
  final String chapter;
  final String title;
  final List<String> formulas;
  final String keyConcept;

  NoteTopic({
    required this.id,
    required this.subject,
    required this.chapter,
    required this.title,
    required this.formulas,
    required this.keyConcept,
  });
}

class NotesScreen extends StatefulWidget {
  const NotesScreen({Key? key}) : super(key: key);

  @override
  State<NotesScreen> createState() => _NotesScreenState();
}

class _NotesScreenState extends State<NotesScreen> {
  String _selectedSubject = 'All';
  String _searchQuery = '';

  final List<NoteTopic> _notes = [
    NoteTopic(
      id: 'n_1',
      subject: 'Physics',
      chapter: 'Electric Charges & Fields',
      title: 'Gauss Law & Field Derivations',
      formulas: [
        'Φ = ∮ E · dA = q_enclosed / ε₀',
        'E_inf_wire = λ / (2πε₀r)',
        'E_sheet = σ / (2ε₀)',
      ],
      keyConcept: 'Electric flux through any closed Gaussian surface equals net enclosed charge divided by permittivity of free space.',
    ),
    NoteTopic(
      id: 'n_2',
      subject: 'Physics',
      chapter: 'Current Electricity',
      title: 'Kirchhoff\'s Laws & Drift Velocity',
      formulas: [
        'v_d = -eEτ / m',
        'I = n e A v_d',
        'Σ I_in = Σ I_out (KCL)',
        'Σ ΔV = 0 (KVL)',
      ],
      keyConcept: 'Drift velocity is directly proportional to applied electric field. Current is macroscopic flux of drifting charges.',
    ),
    NoteTopic(
      id: 'n_3',
      subject: 'Chemistry',
      chapter: 'Electrochemistry',
      title: 'Nernst Equation & Gibbs Free Energy',
      formulas: [
        'E_cell = E°_cell - (0.0591/n) log Q',
        'ΔG° = -n F E°_cell',
        'Λ_m = κ × 1000 / M',
      ],
      keyConcept: 'Relates standard reduction potentials with concentration reaction quotients at 298 K.',
    ),
    NoteTopic(
      id: 'n_4',
      subject: 'Chemistry',
      chapter: 'Chemical Kinetics',
      title: 'First-Order Rate Law & Arrhenius Equation',
      formulas: [
        'k = (2.303 / t) log([A]₀ / [A])',
        't_1/2 = 0.693 / k',
        'k = A e^(-Ea / RT)',
      ],
      keyConcept: 'Half-life of a first order reaction is independent of initial reactant concentration.',
    ),
    NoteTopic(
      id: 'n_5',
      subject: 'Mathematics',
      chapter: 'Integrals',
      title: 'Definite Integration & King\'s Property',
      formulas: [
        '∫[a, b] f(x) dx = ∫[a, b] f(a+b-x) dx',
        '∫[0, a] f(x) dx = ∫[0, a] f(a-x) dx',
        '∫ e^x [f(x) + f\'(x)] dx = e^x f(x) + C',
      ],
      keyConcept: 'King\'s property eliminates complicated integrands when combined with symmetry.',
    ),
    NoteTopic(
      id: 'n_6',
      subject: 'Biology',
      chapter: 'Molecular Basis of Inheritance',
      title: 'DNA Replication & Central Dogma',
      formulas: [
        'DNA -> RNA (Transcription) -> Protein (Translation)',
        'Chargaff Rule: [A] + [G] = [T] + [C]',
      ],
      keyConcept: 'Semi-conservative replication fork operates 5\' to 3\' continuously on leading strand and discontinuously via Okazaki fragments on lagging strand.',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final subjects = ['All', 'Physics', 'Chemistry', 'Mathematics', 'Biology'];

    final filtered = _notes.where((n) {
      final matchSub = _selectedSubject == 'All' || n.subject == _selectedSubject;
      final matchQuery = _searchQuery.isEmpty ||
          n.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          n.chapter.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          n.formulas.any((f) => f.toLowerCase().contains(_searchQuery.toLowerCase()));
      return matchSub && matchQuery;
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Formula Sheets & High-Yield Notes', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
      ),
      body: Column(
        children: [
          // Search & Filter
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: TextField(
              onChanged: (val) => setState(() => _searchQuery = val),
              style: const TextStyle(color: Colors.white, fontSize: 14),
              decoration: InputDecoration(
                hintText: 'Search formulas, derivations, laws...',
                hintStyle: const TextStyle(color: Colors.white38),
                prefixIcon: const Icon(Icons.search, color: Colors.white54),
                filled: true,
                fillColor: AppTheme.cardDark,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: AppTheme.borderDark)),
                contentPadding: const EdgeInsets.symmetric(vertical: 0),
              ),
            ),
          ),

          // Subject Chips
          SizedBox(
            height: 40,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 12),
              itemCount: subjects.length,
              itemBuilder: (context, idx) {
                final sub = subjects[idx];
                final isSel = _selectedSubject == sub;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: FilterChip(
                    label: Text(sub),
                    selected: isSel,
                    onSelected: (_) => setState(() => _selectedSubject = sub),
                    selectedColor: AppTheme.brandPrimary,
                    backgroundColor: AppTheme.cardDark,
                    labelStyle: TextStyle(
                      color: isSel ? Colors.white : Colors.white60,
                      fontWeight: isSel ? FontWeight.bold : FontWeight.normal,
                      fontSize: 12,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                      side: BorderSide(color: isSel ? AppTheme.brandPrimary : AppTheme.borderDark),
                    ),
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 8),

          // Notes List
          Expanded(
            child: filtered.isEmpty
                ? const Center(child: Text('No notes found for query.', style: TextStyle(color: Colors.white54)))
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: filtered.length,
                    itemBuilder: (context, i) {
                      final note = filtered[i];

                      return Card(
                        color: AppTheme.cardDark,
                        margin: const EdgeInsets.only(bottom: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                          side: const BorderSide(color: AppTheme.borderDark),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                    decoration: BoxDecoration(
                                      color: AppTheme.brandPrimary.withOpacity(0.2),
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Text(
                                      note.subject,
                                      style: const TextStyle(color: AppTheme.brandPrimary, fontSize: 11, fontWeight: FontWeight.bold),
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(
                                      note.chapter,
                                      style: const TextStyle(color: Colors.white54, fontSize: 11),
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 10),
                              Text(
                                note.title,
                                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                              ),
                              const SizedBox(height: 12),

                              // Formulas Box
                              Container(
                                width: double.infinity,
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: AppTheme.bgDark,
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(color: AppTheme.borderDark),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: note.formulas.map((f) => Padding(
                                    padding: const EdgeInsets.only(bottom: 4),
                                    child: Text(
                                      f,
                                      style: const TextStyle(
                                        color: AppTheme.brandGold,
                                        fontFamily: 'monospace',
                                        fontSize: 13,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  )).toList(),
                                ),
                              ),
                              const SizedBox(height: 10),

                              Text(
                                note.keyConcept,
                                style: const TextStyle(color: Colors.white70, fontSize: 12, height: 1.4),
                              ),
                              const SizedBox(height: 12),

                              // Action buttons
                              Row(
                                mainAxisAlignment: MainAxisAlignment.end,
                                children: [
                                  TextButton.icon(
                                    icon: const Icon(Icons.copy, size: 14, color: Colors.white60),
                                    label: const Text('Copy', style: TextStyle(color: Colors.white60, fontSize: 12)),
                                    onPressed: () {
                                      Clipboard.setData(ClipboardData(text: note.formulas.join('\n')));
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        const SnackBar(
                                          backgroundColor: AppTheme.brandGreen,
                                          content: Text('Formulas copied to clipboard!', style: TextStyle(color: Colors.white)),
                                        ),
                                      );
                                    },
                                  ),
                                  const SizedBox(width: 8),
                                  ElevatedButton.icon(
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: AppTheme.brandPrimary.withOpacity(0.2),
                                      foregroundColor: AppTheme.brandPrimary,
                                      elevation: 0,
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                    ),
                                    icon: const Icon(Icons.draw, size: 14),
                                    label: const Text('Whiteboard', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                                    onPressed: () {
                                      final chapter = NCERTChapter(
                                        chapterNumber: 1,
                                        title: '${note.subject} - ${note.title}',
                                        pdfUrl: '',
                                        keyFormulas: note.formulas,
                                      );
                                      context.read<AppState>().setWhiteboardChapter(chapter);
                                      Navigator.pop(context);
                                    },
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
