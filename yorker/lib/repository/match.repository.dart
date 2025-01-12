import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:yorker/models/match.dart';

class MatchRepository {
  final String baseUrl;

  MatchRepository({required this.baseUrl});

  Future<List<Match>> fetchMatches(String tournamentId) async {
    final response =
        await http.get(Uri.parse('$baseUrl/api/v1/match/all/$tournamentId'));
    print(response.body);

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      return data.map((matchJson) => Match.fromJson(matchJson)).toList();
    } else {
      throw Exception('Failed to fetch matches');
    }
  }
}
