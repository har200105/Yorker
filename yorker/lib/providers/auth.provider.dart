import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http/http.dart' as http;
import 'package:yorker/constants.dart';

import 'package:yorker/repository/auth.local.repository.dart';

final authProvider = FutureProvider<bool>((ref) async {
  final String? token = await LocalStorage.getToken();

  if (token == null || token.isEmpty) {
    return false;
  }

  final response = await http.get(
    Uri.parse('$baseUrl/api/v1/user/me'),
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
