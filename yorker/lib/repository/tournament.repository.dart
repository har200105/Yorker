import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:yorker/models/tournament.dart';

class TournamentRepository {
  final String baseUrl;

  TournamentRepository({required this.baseUrl});

  Future<List<Tournament>> fetchTournaments() async {
    final response =
        await http.get(Uri.parse('$baseUrl/api/v1/tournament/all'));
    print('$baseUrl/api/v1/tournament/all');
    print(response.body);
    if (response.statusCode == 200) {
      print("here");
      final List<dynamic> data = json.decode(response.body);
      return data
          .map((tournamentJson) => Tournament.fromJson(tournamentJson))
          .toList();
    } else {
      throw Exception('Failed to fetch tournaments');
    }
  }
}
