import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:yorker/constants.dart';

class ApiService {
  Future<String?> login(String username, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/v1/user/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'username': username,
        'password': password,
      }),
    );
    print(username);
    print(password);

    print("response.body : ${response.body}");

    if (response.statusCode == 200 || response.statusCode == 201) {
      final data = jsonDecode(response.body);
      return data['accessToken'];
    } else {
      throw Exception('Login failed');
    }
  }

  Future<bool> isTokenValid(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/user/me'),
      headers: {'Authorization': 'Bearer $token'},
    );

    if (response.statusCode == 200) {
      return true; // Token is valid
    } else if (response.statusCode == 401) {
      return false; // Token expired
    } else {
      throw Exception('Error checking token validity');
    }
  }
}
