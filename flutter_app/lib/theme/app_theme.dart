import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Brand Emerald & Teal Colors
  static const Color brandPrimary = Color(0xFF059669);
  static const Color brandAccent = Color(0xFF10B981);
  static const Color brandGold = Color(0xFFFACC15);
  static const Color brandBlue = Color(0xFF38BDF8);
  static const Color brandPurple = Color(0xFFA855F7);
  static const Color brandRose = Color(0xFFF43F5E);

  // Surface Colors
  static const Color bgDark = Color(0xFF090D16);
  static const Color cardDark = Color(0xFF111827);
  static const Color borderDark = Color(0xFF1F2937);

  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: bgDark,
      primaryColor: brandPrimary,
      colorScheme: const ColorScheme.dark(
        primary: brandPrimary,
        secondary: brandAccent,
        surface: cardDark,
      ),
      textTheme: GoogleFonts.outfitTextTheme(ThemeData.dark().textTheme),
      cardTheme: CardTheme(
        color: cardDark,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: borderDark, width: 1),
        ),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: bgDark,
        elevation: 0,
        centerTitle: false,
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: cardDark,
        selectedItemColor: brandAccent,
        unselectedItemColor: Color(0xFF9CA3AF),
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
    );
  }
}
