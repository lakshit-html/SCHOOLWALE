import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../theme/app_theme.dart';

class DrawnStroke {
  final List<Offset> points;
  final Color color;
  final double strokeWidth;
  final bool isEraser;

  DrawnStroke({
    required this.points,
    required this.color,
    required this.strokeWidth,
    this.isEraser = false,
  });
}

class WhiteboardScreen extends StatefulWidget {
  const WhiteboardScreen({Key? key}) : super(key: key);

  @override
  State<WhiteboardScreen> createState() => _WhiteboardScreenState();
}

class _WhiteboardScreenState extends State<WhiteboardScreen> {
  final List<DrawnStroke> _strokes = [];
  final List<DrawnStroke> _undoneStrokes = [];

  Color _activeColor = const Color(0xFFFACC15); // PW Yellow
  double _strokeWidth = 4.0;
  bool _isEraser = false;

  final List<Color> _palette = const [
    Color(0xFFF8FAFC), // Chalk White
    Color(0xFFFACC15), // PW Yellow
    Color(0xFF38BDF8), // Cyan
    Color(0xFF4ADE80), // Green
    Color(0xFFF87171), // Coral
    Color(0xFFC084FC), // Purple
  ];

  void _handleUndo() {
    if (_strokes.isNotEmpty) {
      setState(() {
        _undoneStrokes.add(_strokes.removeLast());
      });
    }
  }

  void _handleRedo() {
    if (_undoneStrokes.isNotEmpty) {
      setState(() {
        _strokes.add(_undoneStrokes.removeLast());
      });
    }
  }

  void _handleClear() {
    setState(() {
      _strokes.clear();
      _undoneStrokes.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final activeChapter = appState.activeWhiteboardChapter;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Smart Teacher Board', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        actions: [
          IconButton(
            icon: const Icon(Icons.undo, size: 20),
            onPressed: _strokes.isNotEmpty ? _handleUndo : null,
          ),
          IconButton(
            icon: const Icon(Icons.redo, size: 20),
            onPressed: _undoneStrokes.isNotEmpty ? _handleRedo : null,
          ),
          IconButton(
            icon: const Icon(Icons.delete_sweep, size: 20, color: AppTheme.brandRose),
            onPressed: _strokes.isNotEmpty ? _handleClear : null,
            tooltip: 'Clear Board',
          ),
        ],
      ),
      body: Column(
        children: [
          // Active NCERT chapter HUD
          if (activeChapter != null)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: const Color(0xFF064E3B),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.brandAccent.withOpacity(0.4)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.auto_awesome, color: AppTheme.brandGold, size: 18),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Annotating: Ch ${activeChapter.chapterNumber} • ${activeChapter.title}',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.white),
                          overflow: TextOverflow.ellipsis,
                        ),
                        if (activeChapter.keyFormulas.isNotEmpty)
                          Text(
                            'Formulas: ${activeChapter.keyFormulas.take(2).join(" | ")}',
                            style: const TextStyle(fontSize: 10, color: AppTheme.brandGold),
                            overflow: TextOverflow.ellipsis,
                          ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, size: 16, color: Colors.white54),
                    onPressed: () => appState.clearWhiteboardChapter(),
                  )
                ],
              ),
            ),

          // Tools toolbar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            color: AppTheme.cardDark,
            child: Row(
              children: [
                // Pen / Eraser toggle
                IconButton(
                  icon: Icon(Icons.edit, color: !_isEraser ? AppTheme.brandAccent : Colors.white54, size: 20),
                  onPressed: () => setState(() => _isEraser = false),
                  tooltip: 'Pen',
                ),
                IconButton(
                  icon: Icon(Icons.cleaning_services, color: _isEraser ? AppTheme.brandRose : Colors.white54, size: 20),
                  onPressed: () => setState(() => _isEraser = true),
                  tooltip: 'Eraser',
                ),

                const VerticalDivider(width: 16, color: AppTheme.borderDark),

                // Palette
                Expanded(
                  child: SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: _palette.map((color) {
                        final isSelected = !_isEraser && _activeColor == color;
                        return GestureDetector(
                          onTap: () => setState(() {
                            _activeColor = color;
                            _isEraser = false;
                          }),
                          child: Container(
                            margin: const EdgeInsets.symmetric(horizontal: 4),
                            width: 24,
                            height: 24,
                            decoration: BoxDecoration(
                              color: color,
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: isSelected ? Colors.white : Colors.transparent,
                                width: 2,
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Canvas Surface
          Expanded(
            child: Container(
              margin: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFF0B1914), // PW Digital Slate
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppTheme.borderDark, width: 2),
                boxShadow: const [
                  BoxShadow(color: Colors.black45, blurRadius: 10, offset: Offset(0, 4)),
                ],
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(18),
                child: GestureDetector(
                  onPanStart: (details) {
                    final box = context.findRenderObject() as RenderBox?;
                    if (box == null) return;
                    final localPos = details.localPosition;
                    setState(() {
                      _undoneStrokes.clear();
                      _strokes.add(DrawnStroke(
                        points: [localPos],
                        color: _isEraser ? const Color(0xFF0B1914) : _activeColor,
                        strokeWidth: _isEraser ? 24.0 : _strokeWidth,
                        isEraser: _isEraser,
                      ));
                    });
                  },
                  onPanUpdate: (details) {
                    final localPos = details.localPosition;
                    setState(() {
                      if (_strokes.isNotEmpty) {
                        _strokes.last.points.add(localPos);
                      }
                    });
                  },
                  child: CustomPaint(
                    painter: _BoardPainter(strokes: _strokes),
                    size: Size.infinite,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _BoardPainter extends CustomPainter {
  final List<DrawnStroke> strokes;

  _BoardPainter({required this.strokes});

  @override
  void paint(Canvas canvas, Size size) {
    // 1. Draw teacher board coordinate grid dots
    final dotPaint = Paint()..color = const Color(0x22164E3C);
    const spacing = 32.0;
    for (double x = spacing; x < size.width; x += spacing) {
      for (double y = spacing; y < size.height; y += spacing) {
        canvas.drawCircle(Offset(x, y), 1.2, dotPaint);
      }
    }

    // 2. Render student & teacher strokes
    for (final stroke in strokes) {
      final paint = Paint()
        ..color = stroke.color
        ..strokeWidth = stroke.strokeWidth
        ..strokeCap = StrokeCap.round
        ..strokeJoin = StrokeJoin.round
        ..style = PaintingStyle.stroke;

      if (stroke.points.length > 1) {
        for (int i = 0; i < stroke.points.length - 1; i++) {
          canvas.drawLine(stroke.points[i], stroke.points[i + 1], paint);
        }
      } else if (stroke.points.length == 1) {
        canvas.drawCircle(stroke.points.first, stroke.strokeWidth / 2, paint);
      }
    }
  }

  @override
  bool shouldRepaint(covariant _BoardPainter oldDelegate) => true;
}
