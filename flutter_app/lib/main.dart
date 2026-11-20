import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/app_state.dart';
import 'theme/app_theme.dart';
import 'screens/splash_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AppState()),
      ],
      child: const StudyForgeApp(),
    ),
  );
}

class StudyForgeApp extends StatelessWidget {
  const StudyForgeApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final themeMode = context.watch<AppState>().themeMode;

    ThemeData activeTheme;
    switch (themeMode) {
      case AppThemeMode.light:
        activeTheme = AppTheme.lightTheme;
        break;
      case AppThemeMode.monochrome:
        activeTheme = AppTheme.monochromeTheme;
        break;
      case AppThemeMode.dark:
      default:
        activeTheme = AppTheme.darkTheme;
        break;
    }

    return MaterialApp(
      title: 'StudyForge',
      debugShowCheckedModeBanner: false,
      theme: activeTheme,
      home: const SplashScreen(),
    );
  }
}
