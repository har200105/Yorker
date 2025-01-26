import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import 'package:yorker/repository/auth.local.repository.dart';

class TeamDetailsPage extends StatefulWidget {
  final String teamId;

  const TeamDetailsPage({super.key, required this.teamId});

  @override
  _TeamDetailsPageState createState() => _TeamDetailsPageState();
}

class _TeamDetailsPageState extends State<TeamDetailsPage> {
  late Future<Map<String, dynamic>> _teamDetails;

  Future<Map<String, dynamic>> fetchTeamDetails(String teamId) async {
    final String? token = await LocalStorage.getToken();
    final url = 'http://13.127.41.3/api/v1/user-team/players/$teamId';

    final response = await http
        .get(Uri.parse(url), headers: {'Authorization': 'Bearer $token'});

    if (response.statusCode == 200 || response.statusCode == 201) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load team details');
    }
  }

  @override
  void initState() {
    super.initState();
    _teamDetails = fetchTeamDetails(widget.teamId);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Team Details")),
      body: FutureBuilder<Map<String, dynamic>>(
        future: _teamDetails,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (!snapshot.hasData) {
            return const Center(child: Text('No data available'));
          }

          var team = snapshot.data!;
          var players = team['user_team_players'] ?? [];
          var isScoredComputed = team['isScoredComputed'];

          return Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 20),
                if (isScoredComputed)
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Points Obtained: ${team['pointsObtained']}',
                        style: const TextStyle(fontSize: 16),
                      ),
                      Text(
                        'Leaderboard Rank: ${team['leaderBoardRank']}',
                        style: const TextStyle(fontSize: 16),
                      ),
                    ],
                  ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 16),
                    if (!isScoredComputed)
                      const Text(
                        'Match is yet to complete.',
                        style: TextStyle(color: Colors.red, fontSize: 16),
                      ),
                    Text(
                      'Match Name: ${team['match']['name']}',
                      style: const TextStyle(fontSize: 16),
                    ),
                    Text(
                      'Venue: ${team['match']['venue']}',
                      style: const TextStyle(fontSize: 16),
                    ),
                    Text(
                      'Date: ${DateFormat('MMM dd yyyy').format(DateTime.parse(team['match']['date']))}',
                      style: const TextStyle(fontSize: 16),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                const Text(
                  'Players:',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                ),
                const SizedBox(height: 10),
                Expanded(
                  child: ListView.builder(
                    itemCount: players.length,
                    itemBuilder: (context, index) {
                      var player = players[index];
                      return Card(
                        elevation: 4,
                        margin: const EdgeInsets.symmetric(vertical: 8),
                        child: ListTile(
                          title: Text(player['player']['name']),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                  'Role: ${player['player']['role']} | Credits: ${player['player']['credits']}'),
                              if (isScoredComputed)
                                Text('Points: ${player['points']}'),
                            ],
                          ),
                          trailing: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              if (player['isCaptain'] == true)
                                const Text('Captain',
                                    style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        color: Colors.green)),
                              if (player['isViceCaptain'] == true)
                                const Text('Vice Captain',
                                    style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        color: Colors.blue)),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
