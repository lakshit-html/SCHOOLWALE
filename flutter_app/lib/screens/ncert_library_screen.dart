import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../services/ncert_catalog.dart';
import '../models/ncert_book.dart';
import '../providers/app_state.dart';
import '../theme/app_theme.dart';

class NCERTLibraryScreen extends StatefulWidget {
  const NCERTLibraryScreen({Key? key}) : super(key: key);

  @override
  State<NCERTLibraryScreen> createState() => _NCERTLibraryScreenState();
}

class _NCERTLibraryScreenState extends State<NCERTLibraryScreen> {
  String _selectedClass = 'All';
  String _selectedSubject = 'All';
  String _searchQuery = '';

  final List<String> _classes = ['All', 'Class 12', 'Class 11', 'Class 10', 'Class 9'];
  final List<String> _subjects = ['All', 'Physics', 'Chemistry', 'Mathematics', 'Science'];

  @override
  Widget build(BuildContext context) {
    final books = NCERTCatalog.books.filter((b) {
      final matchesClass = _selectedClass === 'All' || b.classLevel == _selectedClass;
      final matchesSub = _selectedSubject === 'All' || b.subject == _selectedSubject;
      final matchesQuery = _searchQuery.isEmpty ||
          b.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          b.chapters.any((c) => c.title.toLowerCase().contains(_searchQuery.toLowerCase()));
      return matchesClass && matchesSub && matchesQuery;
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('NCERT Digital Library', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        actions: [
          IconButton(
            icon: const Icon(Icons.open_in_new, size: 20),
            tooltip: 'Visit ncert.nic.in portal',
            onPressed: () => _launchUrl('https://ncert.nic.in/textbook.php'),
          ),
        ],
      ),
      body: Column(
        children: [
          // Search & Filter header
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            color: AppTheme.cardDark,
            child: Column(
              children: [
                // Search box
                TextField(
                  style: const TextStyle(fontSize: 13, color: Colors.white),
                  decoration: InputDecoration(
                    hintText: 'Search chapters, formulas, topics...',
                    hintStyle: const TextStyle(color: Colors.white38, fontSize: 13),
                    prefixIcon: const Icon(Icons.search, size: 18, color: Colors.white54),
                    filled: true,
                    fillColor: const Color(0xFF1E293B),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
                  ),
                  onChanged: (val) => setState(() => _searchQuery = val.trim()),
                ),
                const SizedBox(height: 8),

                // Class filter chips
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: _classes.map((cls) {
                      final isSelected = _selectedClass == cls;
                      return Padding(
                        padding: const EdgeInsets.only(right: 6),
                        child: ChoiceChip(
                          label: Text(cls, style: TextStyle(fontSize: 11, color: isSelected ? Colors.white : Colors.white70)),
                          selected: isSelected,
                          selectedColor: AppTheme.brandPrimary,
                          backgroundColor: const Color(0xFF1E293B),
                          side: BorderSide.none,
                          onSelected: (val) => setState(() => _selectedClass = cls),
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ],
            ),
          ),

          // Books & chapters list
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: books.length,
              itemBuilder: (context, index) {
                final book = books[index];
                return _buildBookCard(context, book);
              },
            ),
          )
        ],
      ),
    );
  }

  Widget _buildBookCard(BuildContext context, NCERTBook book) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: AppTheme.cardDark,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppTheme.borderDark),
      ),
      child: Column(
        children: [
          // Book banner
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: Color(book.coverColorHex),
              borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.between,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(color: Colors.white24, borderRadius: BorderRadius.circular(6)),
                          child: Text(book.classLevel, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white)),
                        ),
                        const SizedBox(width: 6),
                        Text(book.subject, style: const TextStyle(fontSize: 11, color: Colors.white70)),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(book.title, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white)),
                  ],
                ),
                IconButton(
                  icon: const Icon(Icons.open_in_browser, color: Colors.white),
                  onPressed: () => _launchUrl(book.officialPortalUrl),
                  tooltip: 'Open Book on NCERT Portal',
                )
              ],
            ),
          ),

          // Chapter list
          ...book.chapters.map((ch) => Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: const BoxDecoration(
              border: Border(bottom: BorderSide(color: Color(0xFF1E293B))),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    CircleAvatar(
                      radius: 12,
                      backgroundColor: AppTheme.brandPrimary.withOpacity(0.2),
                      child: Text('${ch.chapterNumber}', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.brandAccent)),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(ch.title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Colors.white)),
                          const SizedBox(height: 2),
                          Text(ch.summary, style: const TextStyle(fontSize: 11, color: Colors.white54), maxLines: 2, overflow: TextOverflow.ellipsis),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),

                // Action buttons row
                Row(
                  children: [
                    // PDF Button
                    TextButton.icon(
                      style: TextButton.styleFrom(
                        backgroundColor: AppTheme.brandPrimary.withOpacity(0.15),
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      icon: const Icon(Icons.picture_as_pdf, size: 14, color: AppTheme.brandAccent),
                      label: const Text('PDF', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.brandAccent)),
                      onPressed: () => _launchUrl(ch.pdfUrl),
                    ),
                    const SizedBox(width: 8),

                    // Quick Reader
                    TextButton.icon(
                      style: TextButton.styleFrom(
                        backgroundColor: const Color(0xFF1E293B),
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      icon: const Icon(Icons.menu_book, size: 14, color: Colors.white70),
                      label: const Text('Reader', style: TextStyle(fontSize: 11, color: Colors.white70)),
                      onPressed: () => _showReaderDialog(context, book, ch),
                    ),
                    const Spacer(),

                    // Annotate in Whiteboard
                    ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.brandPrimary,
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      icon: const Icon(Icons.draw, size: 14, color: Colors.white),
                      label: const Text('Annotate', style: TextStyle(fontSize: 11, color: Colors.white, fontWeight: FontWeight.bold)),
                      onPressed: () {
                        context.read<AppState>().setWhiteboardChapter(ch);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Loaded "${ch.title}" formulas into Whiteboard!'), duration: const Duration(seconds: 1)),
                        );
                      },
                    ),
                  ],
                )
              ],
            ),
          )),
        ],
      ),
    );
  }

  void _showReaderDialog(BuildContext context, NCERTBook book, NCERTChapter ch) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => Container(
        height: MediaQuery.of(context).size.height * 0.85,
        decoration: const BoxDecoration(
          color: AppTheme.cardDark,
          borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          border: Border(top: BorderSide(color: AppTheme.borderDark, width: 1.5)),
        ),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
              decoration: BoxDecoration(
                color: Color(book.coverColorHex),
                borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Chapter ${ch.chapterNumber}', style: const TextStyle(fontSize: 11, color: Colors.white70)),
                        Text(ch.title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: Colors.white),
                    onPressed: () => Navigator.pop(context),
                  )
                ],
              ),
            ),
            Expanded(
              child: ListView(
                padding: const EdgeInsets.all(20),
                children: [
                  const Text('Chapter Synopsis', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Colors.white70)),
                  const SizedBox(height: 6),
                  Text(ch.summary, style: const TextStyle(fontSize: 13, height: 1.5, color: Colors.white)),
                  const SizedBox(height: 16),

                  if (ch.keyFormulas.isNotEmpty) ...[
                    const Text('⚡ Key NCERT Formulas', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppTheme.brandGold)),
                    const SizedBox(height: 8),
                    ...ch.keyFormulas.map((f) => Container(
                      margin: const EdgeInsets.only(bottom: 6),
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      decoration: BoxDecoration(
                        color: Colors.black38,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: AppTheme.borderDark),
                      ),
                      child: Text(f, style: const TextStyle(fontFamily: 'monospace', fontSize: 13, color: AppTheme.brandGold)),
                    )),
                    const SizedBox(height: 16),
                  ],

                  if (ch.highYieldPoints.isNotEmpty) ...[
                    const Text('🎯 High-Yield Exam Points', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppTheme.brandBlue)),
                    const SizedBox(height: 8),
                    ...ch.highYieldPoints.map((pt) => Padding(
                      padding: const EdgeInsets.only(bottom: 6),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('• ', style: TextStyle(color: AppTheme.brandBlue, fontSize: 14)),
                          Expanded(child: Text(pt, style: const TextStyle(fontSize: 12, height: 1.4, color: Colors.white70))),
                        ],
                      ),
                    )),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _launchUrl(String url) async {
    final uri = Uri.parse(url);
    if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Could not open link. Please check internet access.')),
        );
      }
    }
  }
}

extension FilterExt<T> on List<T> {
  List<T> filter(bool Function(T) test) {
    return where(test).toList();
  }
}
