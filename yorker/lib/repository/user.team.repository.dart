import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:yorker/models/user_team.dart';
import 'package:yorker/repository/auth.local.repository.dart';

class UserTeamRepository {
  final String baseUrl;

  UserTeamRepository({required this.baseUrl});

  Future<List<UserTeam>> fetchUserTeams(String matchId) async {
    try {
      final String? token = await LocalStorage.getToken();
      final response = await http.get(
          Uri.parse('$baseUrl/api/v1/user-team/match/$matchId'),
          headers: {"Authorization": "Bearer $token"});

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((matchJson) => UserTeam.fromJson(matchJson)).toList();
      } else {
        throw Exception('Failed to fetch user teams');
      }
    } catch (error) {
      print("error : $error");
      throw Exception('An unexpected error occurred');
    }
  }

  Future<UserTeam> fetchPlayersByTeamId(String teamId) async {
    try {
      final String? token = await LocalStorage.getToken();
      final response = await http.get(
          Uri.parse('$baseUrl/api/v1/user-team/players/$teamId'),
          headers: {"Authorization": "Bearer $token"});

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        print(data);
        return UserTeam.fromJson(data);
      } else {
        throw Exception('Failed to fetch user team players');
      }
    } catch (error) {
      print("error in fetchPlayersByTeamId : $error");
      throw Exception('An unexpected error occurred');
    }
  }
}
