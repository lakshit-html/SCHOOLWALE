import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../theme/app_theme.dart';

class DrawnStroke {
  final List<Offset> points;
  final Color color;
  final double strokeWidth;
  final bool isEraser;
  final bool isHighlighter;

  DrawnStroke({
    required this.points,
    required this.color,
    required this.strokeWidth,
    this.isEraser = false,
    this.isHighlighter = false,
  });
}

class WhiteboardScreen extends StatefulWidget {
  const WhiteboardScreen({Key? key}) : super(key: key);

  @override
  State<WhiteboardScreen> createState() => _WhiteboardScreenState();
}

class _WhiteboardScreenState extends State<WhiteboardScreen> {
  // Multi-Slide System
  int _currentSlideIndex = 0;
  final List<int> _slides = [0];
  final Map<int, List<DrawnStroke>> _slideStrokes = {0: []};
  final Map<int, List<DrawnStroke>> _slideUndone = {0: []};

  Color _activeColor = const Color(0xFFFACC15); // PW Yellow
  double _strokeWidth = 4.0;
  bool _isEraser = false;
  bool _isHighlighter = false;

  final List<Color> _palette = const [
    Color(0xFFF8FAFC), // Chalk White
    Color(0xFFFACC15), // PW Yellow
    Color(0xFF38BDF8), // Cyan Blue
    Color(0xFF4ADE80), // Laser Green
    Color(0xFFF87171), // Coral
    Color(0xFFC084FC), // Electric Purple
    Color(0xFFFB923C), // Vivid Orange
  ];

  List<DrawnStroke> get _currentStrokes => _slideStrokes[_currentSlideIndex] ?? [];
  List<DrawnStroke> get _currentUndone => _slideUndone[_currentSlideIndex] ?? [];

  void _addSlide() {
    setState(() {
      final newId = _slides.isNotEmpty ? _slides.last + 1 : 0;
      _slides.add(newId);
      _slideStrokes[newId] = [];
      _slideUndone[newId] = [];
      _currentSlideIndex = newId;
    });
  }

  void _deleteSlide(int slideId) {
    if (_slides.length <= 1) {
      _handleClear();
      return;
    }
    setState(() {
      final removeIdx = _slides.indexOf(slideId);
      _slides.remove(slideId);
      _slideStrokes.remove(slideId);
      _slideUndone.remove(slideId);
      _currentSlideIndex = _slides[removeIdx.clamp(0, _slides.length - 1)];
    });
  }

  void _handleUndo() {
    if (_currentStrokes.isNotEmpty) {
      setState(() {
        final last = _currentStrokes.removeLast();
        _currentUndone.add(last);
      });
    }
  }

  void _handleRedo() {
    if (_currentUndone.isNotEmpty) {
      setState(() {
        final last = _currentUndone.removeLast();
        _currentStrokes.add(last);
      });
    }
  }

  void _handleClear() {
    setState(() {
      _currentStrokes.clear();
      _currentUndone.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final activeChapter = appState.activeWhiteboardChapter;
    final slideNumber = _slides.indexOf(_currentSlideIndex) + 1;
    final totalSlides = _slides.length;

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            const Icon(Icons.draw, size: 20, color: AppTheme.brandPrimary),
            const SizedBox(width: 8),
            const Text('Smart Teacher Board', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
              decoration: BoxDecoration(
                color: AppTheme.cardDark,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: AppTheme.borderDark),
              ),
              child: Text(
                'Slide $slideNumber/$totalSlides',
                style: const TextStyle(fontSize: 11, color: Colors.white70, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.undo, size: 20),
            onPressed: _currentStrokes.isNotEmpty ? _handleUndo : null,
            tooltip: 'Undo',
          ),
          IconButton(
            icon: const Icon(Icons.redo, size: 20),
            onPressed: _currentUndone.isNotEmpty ? _handleRedo : null,
            tooltip: 'Redo',
          ),
          IconButton(
            icon: const Icon(Icons.delete_sweep, size: 20, color: AppTheme.brandRose),
            onPressed: _currentStrokes.isNotEmpty ? _handleClear : null,
            tooltip: 'Clear Slide',
          ),
        ],
      ),
      body: Column(
        children: [
          // Slide selector bar
          Container(
            height: 44,
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: const BoxDecoration(
              color: AppTheme.cardDark,
              border: Border(bottom: BorderSide(color: AppTheme.borderDark)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: _slides.length,
                    itemBuilder: (context, idx) {
                      final sId = _slides[idx];
                      final isSelected = sId == _currentSlideIndex;
                      final sStrokes = _slideStrokes[sId]?.length ?? 0;

                      return Padding(
                        padding: const EdgeInsets.only(right: 6),
                        child: InkWell(
                          onTap: () => setState(() => _currentSlideIndex = sId),
                          borderRadius: BorderRadius.circular(8),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: isSelected ? AppTheme.brandPrimary.withOpacity(0.25) : AppTheme.bgDark,
                              border: Border.all(
                                color: isSelected ? AppTheme.brandPrimary : AppTheme.borderDark,
                              ),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(
                                  'Slide ${idx + 1}',
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                                    color: isSelected ? Colors.white : Colors.white60,
                                  ),
                                ),
                                if (sStrokes > 0) ...[
                                  const SizedBox(width: 4),
                                  Container(
                                    width: 6,
                                    height: 6,
                                    decoration: const BoxDecoration(color: AppTheme.brandGold, shape: BoxShape.circle),
                                  ),
                                ],
                                if (_slides.length > 1) ...[
                                  const SizedBox(width: 4),
                                  InkWell(
                                    onTap: () => _deleteSlide(sId),
                                    child: const Icon(Icons.close, size: 12, color: Colors.white38),
                                  ),
                                ],
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.add_circle, color: AppTheme.brandPrimary, size: 22),
                  onPressed: _addSlide,
                  tooltip: 'Add New Slide',
                ),
              ],
            ),
          ),

          // Active NCERT chapter formula HUD
          if (activeChapter != null)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
              margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: const Color(0xFF064E3B),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppTheme.brandAccent.withOpacity(0.4)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.auto_awesome, color: AppTheme.brandGold, size: 16),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Ch ${activeChapter.chapterNumber}: ${activeChapter.title}',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.white),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: Colors.white54, size: 16),
                    onPressed: () => appState.clearWhiteboardChapter(),
                  ),
                ],
              ),
            ),

          // Canvas Area
          Expanded(
            child: Container(
              margin: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: const Color(0xFF0B0F17),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppTheme.borderDark),
                boxShadow: const [
                  BoxShadow(color: Colors.black45, blurRadius: 10, offset: Offset(0, 4)),
                ],
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(20),
                child: GestureDetector(
                  onPanStart: (details) {
                    final box = context.findRenderObject() as RenderBox?;
                    if (box == null) return;
                    setState(() {
                      _slideUndone[_currentSlideIndex]?.clear();
                      _currentStrokes.add(
                        DrawnStroke(
                          points: [details.localPosition],
                          color: _isEraser ? const Color(0xFF0B0F17) : _activeColor,
                          strokeWidth: _isEraser ? 24.0 : (_isHighlighter ? 18.0 : _strokeWidth),
                          isEraser: _isEraser,
                          isHighlighter: _isHighlighter,
                        ),
                      );
                    });
                  },
                  onPanUpdate: (details) {
                    if (_currentStrokes.isEmpty) return;
                    setState(() {
                      _currentStrokes.last.points.add(details.localPosition);
                    });
                  },
                  child: CustomPaint(
                    painter: _BoardPainter(strokes: _currentStrokes),
                    size: Size.infinite,
                  ),
                ),
              ),
            ),
          ),

          // Tools & Palette Control Bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: const BoxDecoration(
              color: AppTheme.cardDark,
              border: Border(top: BorderSide(color: AppTheme.borderDark)),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Tool selection & Stroke width
                Row(
                  children: [
                    _buildToolChip('Pen', Icons.edit, !_isEraser && !_isHighlighter, () {
                      setState(() {
                        _isEraser = false;
                        _isHighlighter = false;
                      });
                    }),
                    const SizedBox(width: 6),
                    _buildToolChip('Marker', Icons.brush, _isHighlighter, () {
                      setState(() {
                        _isHighlighter = true;
                        _isEraser = false;
                      });
                    }),
                    const SizedBox(width: 6),
                    _buildToolChip('Eraser', Icons.auto_fix_normal, _isEraser, () {
                      setState(() {
                        _isEraser = true;
                        _isHighlighter = false;
                      });
                    }),
                    const Spacer(),

                    // Slide Navigation Arrows
                    IconButton(
                      icon: const Icon(Icons.arrow_back_ios, size: 16),
                      onPressed: slideNumber > 1
                          ? () => setState(() => _currentSlideIndex = _slides[slideNumber - 2])
                          : null,
                    ),
                    Text('$slideNumber / $totalSlides', style: const TextStyle(fontSize: 12, color: Colors.white70)),
                    IconButton(
                      icon: const Icon(Icons.arrow_forward_ios, size: 16),
                      onPressed: slideNumber < totalSlides
                          ? () => setState(() => _currentSlideIndex = _slides[slideNumber])
                          : null,
                    ),
                  ],
                ),
                const SizedBox(height: 8),

                // Color Palette
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: _palette.map((c) {
                    final isSel = !_isEraser && _activeColor.value == c.value;
                    return GestureDetector(
                      onTap: () {
                        setState(() {
                          _activeColor = c;
                          _isEraser = false;
                        });
                      },
                      child: Container(
                        width: 26,
                        height: 26,
                        decoration: BoxDecoration(
                          color: c,
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: isSel ? Colors.white : Colors.transparent,
                            width: 2.5,
                          ),
                          boxShadow: isSel
                              ? [BoxShadow(color: c.withOpacity(0.6), blurRadius: 6)]
                              : null,
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildToolChip(String label, IconData icon, bool isSelected, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(10),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.brandPrimary.withOpacity(0.2) : Colors.transparent,
          border: Border.all(color: isSelected ? AppTheme.brandPrimary : Colors.transparent),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Row(
          children: [
            Icon(icon, size: 14, color: isSelected ? AppTheme.brandPrimary : Colors.white60),
            const SizedBox(width: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                color: isSelected ? Colors.white : Colors.white60,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _BoardPainter extends CustomPainter {
  final List<DrawnStroke> strokes;

  _BoardPainter({required this.strokes});

  @override
  void paint(Canvas canvas, Size size) {
    for (final stroke in strokes) {
      if (stroke.points.isEmpty) continue;

      final paint = Paint()
        ..color = stroke.isHighlighter ? stroke.color.withOpacity(0.4) : stroke.color
        ..strokeWidth = stroke.strokeWidth
        ..strokeCap = StrokeCap.round
        ..strokeJoin = StrokeJoin.round
        ..style = PaintingStyle.stroke;

      if (stroke.points.length == 1) {
        canvas.drawCircle(stroke.points.first, stroke.strokeWidth / 2, paint..style = PaintingStyle.fill);
      } else {
        final path = Path();
        path.moveTo(stroke.points.first.dx, stroke.points.first.dy);
        for (int i = 1; i < stroke.points.length; i++) {
          path.lineTo(stroke.points[i].dx, stroke.points[i].dy);
        }
        canvas.drawPath(path, paint);
      }
    }
  }

  @override
  bool shouldRepaint(covariant _BoardPainter oldDelegate) => true;
}
