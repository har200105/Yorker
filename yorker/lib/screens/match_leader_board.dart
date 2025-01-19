import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:yorker/repository/auth.local.repository.dart';
import 'dart:convert';
import 'package:yorker/screens/match_user_team_detail.dart';

class MatchLeaderBoard extends StatefulWidget {
  final String matchId;
  const MatchLeaderBoard({
    Key? key,
    required this.matchId,
  }) : super(key: key);

  @override
  State<MatchLeaderBoard> createState() => _MatchLeaderBoardState();
}

class _MatchLeaderBoardState extends State<MatchLeaderBoard> {
  List<dynamic> leaderboard = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchLeaderBoard();
  }

  Future<void> fetchLeaderBoard() async {
    try {
      final String? token = await LocalStorage.getToken();

      if (token == null) {
        throw Exception('Token is null');
      }

      final response = await http.get(
        Uri.parse(
          'http://10.106.150.152:4002/api/v1/match/leader-board/${widget.matchId}',
        ),
        headers: {"Authorization": "Bearer $token"},
      );

      if (response.statusCode == 200) {
        setState(() {
          leaderboard = json.decode(response.body);
          isLoading = false;
        });
      } else {
        throw Exception('Failed to load leaderboard');
      }
    } catch (error) {
      setState(() {
        isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: ${error.toString()}')),
      );
    }
  }

  void viewTeamPlayers(String? teamId) {
    if (teamId != null) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => TeamDetailsPage(teamId: teamId),
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Team ID is null')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Match Leaderboard'),
        backgroundColor: Colors.blueAccent,
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : leaderboard.isEmpty
              ? const Center(child: Text('No leaderboard data available'))
              : Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: DataTable(
                      columnSpacing: 16.0, // Adds space between columns
                      columns: const [
                        DataColumn(label: Text('Rank')),
                        DataColumn(label: Text('Player Name')),
                        DataColumn(label: Text('Total Points')),
                        DataColumn(label: Text('View Team')),
                      ],
                      rows: List<DataRow>.generate(
                        leaderboard.length,
                        (index) {
                          final item = leaderboard[index];
                          final userName = item['userName'] ?? 'Unknown User';
                          final totalPoints =
                              item['totalPoints']?.toString() ?? '0';
                          final teamId = item['teamId'] ?? '1';
                          final rank = index + 1;

                          return DataRow(
                            cells: [
                              DataCell(Text('#$rank')),
                              DataCell(Text(userName)),
                              DataCell(Text(totalPoints)),
                              DataCell(
                                TextButton(
                                  onPressed: () => viewTeamPlayers(teamId),
                                  child: const Text(
                                    'View Players',
                                    style: TextStyle(fontSize: 14),
                                  ),
                                ),
                              ),
                            ],
                          );
                        },
                      ),
                    ),
                  ),
                ),
    );
  }
}
