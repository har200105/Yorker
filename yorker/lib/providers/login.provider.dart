import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:yorker/repository/auth.local.repository.dart';
import 'package:yorker/screens/tournaments.dart';
import 'package:yorker/services/api.service.dart';

class LoginState {
  final String? token;
  final String? error;

  LoginState({this.token, this.error});
}

class LoginNotifier extends StateNotifier<LoginState> {
  final ApiService apiService;

  LoginNotifier(this.apiService) : super(LoginState());

  Future<void> login(
      BuildContext context, String username, String password) async {
    try {
      final token = await apiService.login(username, password);
      if (token != null) {
        await LocalStorage.saveToken(token);
        state = LoginState(token: token);
        if (context.mounted) {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => TournamentScreen()),
          );
        }
      } else {
        state = LoginState(error: 'Login failed');
      }
    } catch (e) {
      state = LoginState(error: 'Error occurred during login');
    }
  }
}

final loginProvider = StateNotifierProvider<LoginNotifier, LoginState>((ref) {
  return LoginNotifier(ApiService());
});
