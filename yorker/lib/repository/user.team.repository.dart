import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:yorker/models/match.dart';
import 'package:yorker/models/user_team.dart';
import 'package:yorker/repository/auth.local.repository.dart';

class UserTeamRepository {
  final String baseUrl;

  UserTeamRepository({required this.baseUrl});

  Future<List<UserTeam>?> fetchUserTeams(String matchId) async {
    try {
      final String? token = await LocalStorage.getToken();
      print('$baseUrl/api/v1/user-team/match/$matchId');
      final response = await http.get(
          Uri.parse('$baseUrl/api/v1/user-team/match/$matchId'),
          headers: {"Authorization": "Bearer $token"});
      print(response.body);

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((matchJson) => UserTeam.fromJson(matchJson)).toList();
      } else {
        print("errror");
        throw Exception('Failed to fetch matches');
      }
    } catch (error) {
      print("error : $error");
    }
  }

  Future<Match> fetchMatchById(String matchId) async {
    final response =
        await http.get(Uri.parse('$baseUrl/api/v1/match/all-players/$matchId'));
    print(response.body);

    if (response.statusCode == 200) {
      print("response.body");
      print(response.body);
      print("----");
      final Match match = Match.fromJson(jsonDecode(response.body));
      return match;
    } else {
      throw Exception('Failed to fetch matches');
    }
  }
}
