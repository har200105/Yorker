import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import 'package:yorker/repository/auth.local.repository.dart';

class PublicTeamDetailsPage extends StatefulWidget {
  final String teamId;

  const PublicTeamDetailsPage({super.key, required this.teamId});

  @override
  _PublicTeamDetailsPageState createState() => _PublicTeamDetailsPageState();
}

class _PublicTeamDetailsPageState extends State<PublicTeamDetailsPage> {
  late Future<Map<String, dynamic>> _teamDetails;

  Future<Map<String, dynamic>> fetchTeamDetails(String teamId) async {
    final String? token = await LocalStorage.getToken();
    final url = 'http://10.106.150.152:4002/api/v1/user-team/players/$teamId';

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
          var players = team['players'] ?? [];
          var isScoredComputed = team['isScoredComputed'];
          print(players.length);
          print(players.runtimeType);
          return Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 20),
                if (isScoredComputed == true)
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.green.shade50,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '🏆 Points Obtained: ${team['pointsObtained']}',
                          style: const TextStyle(
                              fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                        Text(
                          '📊 Leaderboard Rank: ${team['leaderBoardRank']}',
                          style: const TextStyle(
                              fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                const SizedBox(height: 16),
                if (isScoredComputed == false)
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.red.shade50,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Text(
                      '⚠️ Match is yet to complete.',
                      style: TextStyle(color: Colors.red, fontSize: 16),
                    ),
                  ),
                const SizedBox(height: 16),
                Card(
                  elevation: 2,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(12.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '🏟 Match Name: ${team['match']['name']}',
                          style: const TextStyle(
                              fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                        Text(
                          '📍 Venue: ${team['match']['venue']}',
                          style: const TextStyle(fontSize: 16),
                        ),
                        Text(
                          '📅 Date: ${DateFormat('MMM dd yyyy').format(DateTime.parse(team['match']['date']))}',
                          style: const TextStyle(fontSize: 16),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                const Text(
                  'Players',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
                ),
                const SizedBox(height: 10),
                Expanded(
                  child: ListView.builder(
                    itemCount: players.length,
                    itemBuilder: (context, index) {
                      var player = players[index];
                      print('player : $player');
                      print(player["photo"]);

                      return Card(
                        elevation: 4,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: ListTile(
                          contentPadding: const EdgeInsets.all(12),
                          leading: CircleAvatar(
                            radius: 28,
                            backgroundImage:
                                NetworkImage(player['player']['photo']),
                          ),
                          title: Text(
                            player['player']['name'],
                            style: const TextStyle(
                                fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Role: ${player['player']['role']} | Credits: ${player['player']['credits']}',
                                style: TextStyle(
                                    fontSize: 14, color: Colors.grey.shade700),
                              ),
                              if (isScoredComputed == true)
                                Text(
                                  'Points: ${player['points']}',
                                  style: TextStyle(
                                      fontSize: 14,
                                      color: Colors.teal.shade700),
                                ),
                            ],
                          ),
                          trailing: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              if (player['isCaptain'] ?? false)
                                Container(
                                  width: 30,
                                  height: 30,
                                  decoration: BoxDecoration(
                                    color: Colors.blue,
                                    shape: BoxShape.circle,
                                  ),
                                  child: Center(
                                    child: Text(
                                      'C',
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold,
                                        fontSize: 18,
                                      ),
                                    ),
                                  ),
                                ),
                              if (player['isViceCaptain'] ?? false)
                                Container(
                                  width: 30,
                                  height: 30,
                                  decoration: BoxDecoration(
                                    color: Colors.blue,
                                    shape: BoxShape.circle,
                                  ),
                                  child: Center(
                                    child: Text(
                                      'VC',
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold,
                                        fontSize: 18,
                                      ),
                                    ),
                                  ),
                                ),
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
