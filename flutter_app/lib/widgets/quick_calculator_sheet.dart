import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class QuickCalculatorSheet extends StatefulWidget {
  const QuickCalculatorSheet({Key? key}) : super(key: key);

  static void show(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const QuickCalculatorSheet(),
    );
  }

  @override
  State<QuickCalculatorSheet> createState() => _QuickCalculatorSheetState();
}

class _QuickCalculatorSheetState extends State<QuickCalculatorSheet> {
  String _display = '0';
  String _expression = '';
  bool _isScientific = true;

  void _onDigit(String d) {
    setState(() {
      if (_display == '0' || _display == 'Error') {
        _display = d;
      } else {
        _display += d;
      }
    });
  }

  void _onOperator(String op) {
    setState(() {
      _expression = '$_display $op ';
      _display = '0';
    });
  }

  void _onClear() {
    setState(() {
      _display = '0';
      _expression = '';
    });
  }

  void _onBackspace() {
    setState(() {
      if (_display.length > 1 && _display != 'Error') {
        _display = _display.substring(0, _display.length - 1);
      } else {
        _display = '0';
      }
    });
  }

  void _onScientific(String fn) {
    setState(() {
      final val = double.tryParse(_display) ?? 0.0;
      double res = 0.0;
      switch (fn) {
        case 'sin':
          res = math.sin(val * (math.pi / 180.0));
          break;
        case 'cos':
          res = math.cos(val * (math.pi / 180.0));
          break;
        case 'tan':
          res = math.tan(val * (math.pi / 180.0));
          break;
        case 'sqrt':
          res = val >= 0 ? math.sqrt(val) : double.nan;
          break;
        case 'ln':
          res = val > 0 ? math.log(val) : double.nan;
          break;
        case 'log':
          res = val > 0 ? math.log(val) / math.ln10 : double.nan;
          break;
        case 'x²':
          res = val * val;
          break;
        case 'π':
          _display = math.pi.toStringAsFixed(6);
          return;
        case 'e':
          _display = math.e.toStringAsFixed(6);
          return;
      }

      if (res.isNaN || res.isInfinite) {
        _display = 'Error';
      } else {
        _display = res.toStringAsFixed(4).replaceAll(RegExp(r'\.?0+$'), '');
      }
    });
  }

  void _onEquals() {
    setState(() {
      if (_expression.isEmpty) return;
      final parts = _expression.trim().split(' ');
      if (parts.length >= 2) {
        final a = double.tryParse(parts[0]) ?? 0.0;
        final op = parts[1];
        final b = double.tryParse(_display) ?? 0.0;
        double result = 0.0;

        switch (op) {
          case '+':
            result = a + b;
            break;
          case '-':
            result = a - b;
            break;
          case '×':
            result = a * b;
            break;
          case '÷':
            result = b != 0 ? a / b : double.nan;
            break;
        }

        if (result.isNaN) {
          _display = 'Error';
        } else {
          _display = result.toStringAsFixed(4).replaceAll(RegExp(r'\.?0+$'), '');
        }
        _expression = '';
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: const BoxDecoration(
        color: AppTheme.cardDark,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Header bar
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(Icons.calculate, color: AppTheme.brandPrimary),
                    const SizedBox(width: 8),
                    const Text('Scientific Study Calculator', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                  ],
                ),
                IconButton(
                  icon: const Icon(Icons.close, color: Colors.white54),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Display
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: AppTheme.bgDark,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.borderDark),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(_expression, style: const TextStyle(color: Colors.white38, fontSize: 13)),
                  const SizedBox(height: 4),
                  Text(
                    _display,
                    style: const TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Scientific Row
            Row(
              children: [
                _buildSciBtn('sin', () => _onScientific('sin')),
                _buildSciBtn('cos', () => _onScientific('cos')),
                _buildSciBtn('tan', () => _onScientific('tan')),
                _buildSciBtn('sqrt', () => _onScientific('sqrt')),
                _buildSciBtn('π', () => _onScientific('π')),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                _buildSciBtn('log', () => _onScientific('log')),
                _buildSciBtn('ln', () => _onScientific('ln')),
                _buildSciBtn('x²', () => _onScientific('x²')),
                _buildSciBtn('e', () => _onScientific('e')),
                _buildSciBtn('C', _onClear, color: AppTheme.brandRose),
              ],
            ),
            const SizedBox(height: 12),

            // Keypad
            _buildKeypadRow(['7', '8', '9', '÷']),
            const SizedBox(height: 8),
            _buildKeypadRow(['4', '5', '6', '×']),
            const SizedBox(height: 8),
            _buildKeypadRow(['1', '2', '3', '-']),
            const SizedBox(height: 8),
            _buildKeypadRow(['0', '.', '⌫', '+']),
            const SizedBox(height: 12),

            // Equals Button
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.brandPrimary,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                onPressed: _onEquals,
                child: const Text('=', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSciBtn(String text, VoidCallback onTap, {Color? color}) {
    return Expanded(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 3),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(10),
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 8),
            decoration: BoxDecoration(
              color: color?.withOpacity(0.2) ?? Colors.white10,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Center(
              child: Text(
                text,
                style: TextStyle(
                  color: color ?? Colors.white70,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildKeypadRow(List<String> keys) {
    return Row(
      children: keys.map((k) {
        final isOp = ['+', '-', '×', '÷'].contains(k);
        return Expanded(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 3),
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: isOp ? AppTheme.brandPrimary.withOpacity(0.3) : AppTheme.bgDark,
                foregroundColor: isOp ? AppTheme.brandPrimary : Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: () {
                if (k == '⌫') {
                  _onBackspace();
                } else if (isOp) {
                  _onOperator(k);
                } else {
                  _onDigit(k);
                }
              },
              child: Text(k, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            ),
          ),
        );
      }).toList(),
    );
  }
}
