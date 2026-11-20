import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../theme/app_theme.dart';
import '../widgets/forge_ai_bottom_sheet.dart';
import 'dashboard_screen.dart';
import 'ncert_library_screen.dart';
import 'study_arena_screen.dart';
import 'whiteboard_screen.dart';
import 'pomodoro_screen.dart';

class MainNavigationScreen extends StatelessWidget {
  const MainNavigationScreen({Key? key}) : super(key: key);

  static const List<Widget> _screens = [
    DashboardScreen(),
    NCERTLibraryScreen(),
    StudyArenaScreen(),
    WhiteboardScreen(),
    PomodoroScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();

    return Scaffold(
      body: IndexedStack(
        index: appState.currentTabIndex,
        children: _screens,
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppTheme.brandPrimary,
        elevation: 6,
        icon: const Icon(Icons.auto_awesome, color: AppTheme.brandGold, size: 18),
        label: const Text('Ask AI', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white)),
        onPressed: () => ForgeAIBottomSheet.show(context),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: appState.currentTabIndex,
        onTap: (index) => appState.setTabIndex(index),
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard_outlined),
            activeIcon: Icon(Icons.dashboard),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.menu_book_outlined),
            activeIcon: Icon(Icons.menu_book),
            label: 'NCERT',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.sports_esports_outlined),
            activeIcon: Icon(Icons.sports_esports),
            label: 'Arena',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.draw_outlined),
            activeIcon: Icon(Icons.draw),
            label: 'Board',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.timer_outlined),
            activeIcon: Icon(Icons.timer),
            label: 'Focus',
          ),
        ],
      ),
    );
  }
}
