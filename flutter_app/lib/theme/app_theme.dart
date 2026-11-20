import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

enum AppThemeMode { dark, light, monochrome }

class AppTheme {
  // Brand Emerald & Cyber Colors
  static const Color brandPrimary = Color(0xFF059669);
  static const Color brandAccent = Color(0xFF10B981);
  static const Color brandGold = Color(0xFFFACC15);
  static const Color brandBlue = Color(0xFF38BDF8);
  static const Color brandPurple = Color(0xFFA855F7);
  static const Color brandRose = Color(0xFFF43F5E);
  static const Color brandGreen = Color(0xFF10B981);

  // Surface Colors - Cyber Dark
  static const Color bgDark = Color(0xFF090D16);
  static const Color cardDark = Color(0xFF111827);
  static const Color borderDark = Color(0xFF1F2937);

  // Surface Colors - Crisp Light Mode
  static const Color bgLight = Color(0xFFF8FAFC);
  static const Color cardLight = Color(0xFFFFFFFF);
  static const Color borderLight = Color(0xFFE2E8F0);
  static const Color textDark = Color(0xFF0F172A);
  static const Color textMuted = Color(0xFF64748B);

  // Surface Colors - Pure Monochrome (Black & White Paper Mode)
  static const Color monoBg = Color(0xFF000000);
  static const Color monoCard = Color(0xFF121212);
  static const Color monoCardAlt = Color(0xFF1E1E1E);
  static const Color monoBorder = Color(0xFF2E2E2E);
  static const Color monoWhite = Color(0xFFFFFFFF);
  static const Color monoMuted = Color(0xFFA1A1AA);

  // Cyber Dark Theme (Default)
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
      cardTheme: CardThemeData(
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

  // Crisp Professional Light Theme
  static ThemeData get lightTheme {
    return ThemeData(
      brightness: Brightness.light,
      scaffoldBackgroundColor: bgLight,
      primaryColor: brandPrimary,
      colorScheme: const ColorScheme.light(
        primary: brandPrimary,
        secondary: brandAccent,
        surface: cardLight,
      ),
      textTheme: GoogleFonts.outfitTextTheme(ThemeData.light().textTheme),
      cardTheme: CardThemeData(
        color: cardLight,
        elevation: 2,
        shadowColor: Colors.black.withOpacity(0.04),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: borderLight, width: 1),
        ),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: cardLight,
        elevation: 0,
        centerTitle: false,
        iconTheme: IconThemeData(color: textDark),
        titleTextStyle: TextStyle(color: textDark, fontSize: 18, fontWeight: FontWeight.bold),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: cardLight,
        selectedItemColor: brandPrimary,
        unselectedItemColor: textMuted,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
    );
  }

  // Pure Black & White Minimalist Theme (High-Contrast / Paper & Ink)
  static ThemeData get monochromeTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: monoBg,
      primaryColor: monoWhite,
      colorScheme: const ColorScheme.dark(
        primary: monoWhite,
        secondary: monoMuted,
        surface: monoCard,
      ),
      textTheme: GoogleFonts.interTextTheme(ThemeData.dark().textTheme),
      cardTheme: CardThemeData(
        color: monoCard,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: monoBorder, width: 1),
        ),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: monoBg,
        elevation: 0,
        centerTitle: false,
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: monoCard,
        selectedItemColor: monoWhite,
        unselectedItemColor: Color(0xFF71717A),
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
    );
  }
}
