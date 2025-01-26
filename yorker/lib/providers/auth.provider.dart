import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import 'package:yorker/repository/auth.local.repository.dart';

final authProvider = FutureProvider<bool>((ref) async {
  final prefs = await SharedPreferences.getInstance();
  final token = prefs.getString('accessToken');

  if (token == null || token.isEmpty) {
    return false;
  }

  final response = await http.get(
    Uri.parse('http://13.127.41.3/api/v1/user/me'),
    headers: {
      'Authorization': 'Bearer $token',
    },
  );

  if (response.statusCode == 401 || response.statusCode >= 400) {
    await LocalStorage.clearToken();
    return false;
  }

  return true;
});
