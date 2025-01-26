import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:yorker/repository/auth.local.repository.dart';
import 'package:yorker/screens/match_user_team_detail.dart';

class UserTeamsListPage extends StatefulWidget {
  final String matchId;

  UserTeamsListPage({required this.matchId});

  @override
  _UserTeamsListPageState createState() => _UserTeamsListPageState();
}

class _UserTeamsListPageState extends State<UserTeamsListPage> {
  late Future<List<Map<String, dynamic>>> _userTeams;
  String matchName = "";

  Future<List<Map<String, dynamic>>> _fetchUserTeams() async {
    final String? token = await LocalStorage.getToken();
    final response = await http.get(
        Uri.parse(
          'http://13.127.41.3/api/v1/user-team/match/${widget.matchId}',
        ),
        headers: {'Authorization': 'Bearer $token'});

    if (response.statusCode == 200 || response.statusCode == 201) {
      print(response.body);
      final List<dynamic> data = json.decode(response.body)['userTeams'];
      setState(() {
        matchName = jsonDecode(response.body)['match']['name'];
      });
      print(data);
      return List<Map<String, dynamic>>.from(data);
    } else {
      throw Exception('Failed to load user teams');
    }
  }

  @override
  void initState() {
    super.initState();
    _userTeams = _fetchUserTeams();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: FutureBuilder<List<Map<String, dynamic>>>(
          future: _userTeams,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return Text('Loading...');
            } else if (snapshot.hasError) {
              return Text('Error');
            } else {
              return Text(matchName);
            }
          },
        ),
      ),
      body: FutureBuilder<List<Map<String, dynamic>>>(
        future: _userTeams,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return Center(child: Text('No teams available'));
          } else {
            final userTeams = snapshot.data!;
            return ListView.builder(
              itemCount: userTeams.length,
              itemBuilder: (context, index) {
                var team = userTeams[index];
                print(team);
                var match = team['userTeamWithoutPlayers']['match'];
                bool isScoredComputed =
                    team['userTeamWithoutPlayers']['isScoredComputed'];

                return Card(
                  margin: EdgeInsets.symmetric(vertical: 10, horizontal: 15),
                  elevation: 6,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(15),
                  ),
                  child: ListTile(
                    contentPadding: EdgeInsets.all(15),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => TeamDetailsPage(
                            teamId: team['userTeamWithoutPlayers']['id'],
                          ),
                        ),
                      );
                    },
                    title: Text(
                      'Team #${team['userTeamWithoutPlayers']['id'].split('-')[0]}',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                        color: Colors.blueGrey,
                      ),
                    ),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Match: ${match['name']}',
                          style: TextStyle(
                              fontSize: 16, fontWeight: FontWeight.w500),
                        ),
                        SizedBox(height: 8),
                        Row(
                          children: [
                            SizedBox(width: 8),
                            Row(
                              children: [
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
                                SizedBox(width: 8),
                                Text(
                                  '${team['captain']['name']}',
                                  style: TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w400),
                                ),
                              ],
                            ),
                          ],
                        ),
                        SizedBox(height: 5),
                        Row(
                          children: [
                            SizedBox(width: 8),
                            Row(
                              children: [
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
                                SizedBox(width: 8),
                                Text(
                                  '${team['viceCaptain']['name']}',
                                  style: TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w400),
                                ),
                              ],
                            ),
                          ],
                        ),
                        SizedBox(height: 10),
                        if (isScoredComputed) ...[
                          Text(
                            'Points: ${team['userTeamWithoutPlayers']['pointsObtained']}',
                            style: TextStyle(fontSize: 14),
                          ),
                          Text(
                            'Rank: ${team['userTeamWithoutPlayers']['leaderBoardRank']}',
                            style: TextStyle(fontSize: 14),
                          ),
                          Text(
                            'Status: ${match['status']}',
                            style: TextStyle(fontSize: 14),
                          ),
                        ],
                        Center(
                          child: TextButton(
                            style: TextButton.styleFrom(
                              foregroundColor: Colors.white,
                              backgroundColor: Colors.teal,
                              padding: const EdgeInsets.symmetric(
                                  vertical: 12, horizontal: 24),
                            ),
                            onPressed: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: (context) => TeamDetailsPage(
                                          teamId: team['userTeamWithoutPlayers']
                                              ['id'],
                                        )),
                              );
                            },
                            child: const Text('View players'),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            );
          }
        },
      ),
    );
  }
}
