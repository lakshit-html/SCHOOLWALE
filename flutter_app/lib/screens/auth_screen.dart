import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../theme/app_theme.dart';
import 'onboarding_questionnaire_screen.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({Key? key}) : super(key: key);

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  bool _isSignUp = true;
  final _nameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();
  bool _obscurePassword = true;

  void _handleSubmit() {
    final name = _nameCtrl.text.trim();
    final email = _emailCtrl.text.trim();

    if (_isSignUp && name.isEmpty) {
      _showError('Please enter your student name');
      return;
    }
    if (email.isEmpty || !email.contains('@')) {
      _showError('Please enter a valid email address');
      return;
    }
    if (_passwordCtrl.text.length < 6) {
      _showError('Password must be at least 6 characters');
      return;
    }

    final appState = context.read<AppState>();
    final currentProfile = appState.profile;

    final updated = currentProfile.copyWith(
      name: name.isNotEmpty ? name : (email.split('@').first),
      email: email,
      isLoggedIn: true,
    );
    appState.updateProfile(updated);

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => const OnboardingQuestionnaireScreen()),
    );
  }

  void _handleGuestLogin() {
    final appState = context.read<AppState>();
    final currentProfile = appState.profile;

    final updated = currentProfile.copyWith(
      name: 'Scholar Aspirant',
      email: 'scholar@studyforge.local',
      isLoggedIn: true,
    );
    appState.updateProfile(updated);

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => const OnboardingQuestionnaireScreen()),
    );
  }

  void _showError(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: AppTheme.brandRose,
        content: Text(msg, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.bgDark,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Top Brand Header
                Container(
                  width: 68,
                  height: 68,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF059669), Color(0xFF10B981), Color(0xFFFACC15)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(22),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF059669).withOpacity(0.4),
                        blurRadius: 20,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: const Center(
                    child: Icon(Icons.shield, color: Colors.white, size: 36),
                  ),
                ),
                const SizedBox(height: 16),

                Text(
                  _isSignUp ? 'Create Scholar Account' : 'Welcome Back, Scholar',
                  style: const TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 6),
                const Text(
                  '100% offline & private academic database stored locally',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.white54, fontSize: 12),
                ),
                const SizedBox(height: 24),

                // Auth Toggle Tabs (Sign In vs Sign Up)
                Container(
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: AppTheme.cardDark,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppTheme.borderDark),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: GestureDetector(
                          onTap: () => setState(() => _isSignUp = true),
                          child: Container(
                            padding: const EdgeInsets.symmetric(vertical: 10),
                            decoration: BoxDecoration(
                              color: _isSignUp ? AppTheme.brandPrimary : Colors.transparent,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Center(
                              child: Text(
                                'Sign Up',
                                style: TextStyle(
                                  color: _isSignUp ? Colors.white : Colors.white60,
                                  fontWeight: _isSignUp ? FontWeight.bold : FontWeight.normal,
                                  fontSize: 13,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                      Expanded(
                        child: GestureDetector(
                          onTap: () => setState(() => _isSignUp = false),
                          child: Container(
                            padding: const EdgeInsets.symmetric(vertical: 10),
                            decoration: BoxDecoration(
                              color: !_isSignUp ? AppTheme.brandPrimary : Colors.transparent,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Center(
                              child: Text(
                                'Log In',
                                style: TextStyle(
                                  color: !_isSignUp ? Colors.white : Colors.white60,
                                  fontWeight: !_isSignUp ? FontWeight.bold : FontWeight.normal,
                                  fontSize: 13,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                // Form Fields Card
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: AppTheme.cardDark,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: AppTheme.borderDark),
                  ),
                  child: Column(
                    children: [
                      if (_isSignUp) ...[
                        _buildInputField('Student Name', 'e.g. Aarav Sharma', _nameCtrl, Icons.person_outline),
                        const SizedBox(height: 14),
                      ],
                      _buildInputField('Email Address', 'scholar@schoolwale.com', _emailCtrl, Icons.email_outlined, keyboardType: TextInputType.emailAddress),
                      const SizedBox(height: 14),
                      _buildInputField(
                        'Password',
                        'Min 6 characters',
                        _passwordCtrl,
                        Icons.lock_outline,
                        isPassword: true,
                        obscureText: _obscurePassword,
                        onTogglePassword: () => setState(() => _obscurePassword = !_obscurePassword),
                      ),
                      const SizedBox(height: 22),

                      // Submit Button
                      SizedBox(
                        width: double.infinity,
                        height: 50,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.brandPrimary,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                            elevation: 6,
                          ),
                          onPressed: _handleSubmit,
                          child: Text(
                            _isSignUp ? 'Create Account & Continue' : 'Log In & Continue',
                            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Guest Scholar Bypass Button
                TextButton.icon(
                  onPressed: _handleGuestLogin,
                  icon: const Icon(Icons.flash_on, color: AppTheme.brandGold, size: 18),
                  label: const Text(
                    'Quick Start as Guest Scholar (No Email Required)',
                    style: TextStyle(color: AppTheme.brandGold, fontWeight: FontWeight.w600, fontSize: 12),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildInputField(
    String label,
    String hint,
    TextEditingController ctrl,
    IconData icon, {
    bool isPassword = false,
    bool obscureText = false,
    VoidCallback? onTogglePassword,
    TextInputType keyboardType = TextInputType.text,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.w500)),
        const SizedBox(height: 6),
        TextField(
          controller: ctrl,
          obscureText: isPassword && obscureText,
          keyboardType: keyboardType,
          style: const TextStyle(color: Colors.white, fontSize: 14),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: const TextStyle(color: Colors.white30, fontSize: 13),
            prefixIcon: Icon(icon, color: Colors.white54, size: 18),
            suffixIcon: isPassword
                ? IconButton(
                    icon: Icon(obscureText ? Icons.visibility_off : Icons.visibility, color: Colors.white38, size: 18),
                    onPressed: onTogglePassword,
                  )
                : null,
            filled: true,
            fillColor: AppTheme.bgDark,
            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
          ),
        ),
      ],
    );
  }
}
