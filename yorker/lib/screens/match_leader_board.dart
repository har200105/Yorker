import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:yorker/constants.dart';
import 'package:yorker/repository/auth.local.repository.dart';
import 'dart:convert';
import 'package:yorker/screens/public_user_team_detail.dart';

class MatchLeaderBoard extends StatefulWidget {
  final String matchId;
  const MatchLeaderBoard({Key? key, required this.matchId}) : super(key: key);

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
          '$baseUrl/api/v1/match/leader-board/${widget.matchId}',
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
          builder: (context) => PublicTeamDetailsPage(teamId: teamId),
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Team ID is null')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Match Leaderboard")),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : leaderboard.isEmpty
              ? const Center(
                  child: Text(
                    'No leaderboard data available',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                )
              : Padding(
                  padding: const EdgeInsets.all(12.0),
                  child: Card(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    elevation: 5,
                    child: Padding(
                      padding: const EdgeInsets.all(12.0),
                      child: SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: DataTableTheme(
                          data: DataTableThemeData(
                            headingRowColor:
                                WidgetStateProperty.all(Colors.teal),
                            headingTextStyle: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                            dataRowColor:
                                WidgetStateProperty.resolveWith<Color?>(
                              (Set<WidgetState> states) {
                                if (states.contains(WidgetState.selected)) {
                                  return Colors.tealAccent[200];
                                }
                                return null;
                              },
                            ),
                          ),
                          child: DataTable(
                            columnSpacing: 24.0,
                            border: TableBorder(
                              horizontalInside: BorderSide(
                                  color: Colors.grey.shade300, width: 1),
                            ),
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
                                final userName =
                                    item['userName'] ?? 'Unknown User';
                                final totalPoints =
                                    item['totalPoints']?.toString() ?? '0';
                                final teamId = item['teamId'] ?? '1';
                                final rank = index + 1;

                                return DataRow(
                                  color: WidgetStateProperty.all(
                                    index % 2 == 0
                                        ? Colors.grey.shade100
                                        : Colors.white,
                                  ),
                                  cells: [
                                    DataCell(Text(
                                      '#$rank',
                                      style: const TextStyle(
                                          fontWeight: FontWeight.bold),
                                    )),
                                    DataCell(Text(userName)),
                                    DataCell(Text(
                                      totalPoints,
                                      style: const TextStyle(
                                          fontWeight: FontWeight.bold),
                                    )),
                                    DataCell(
                                      ElevatedButton(
                                        onPressed: () =>
                                            viewTeamPlayers(teamId),
                                        style: ElevatedButton.styleFrom(
                                          padding: const EdgeInsets.symmetric(
                                              horizontal: 12, vertical: 6),
                                          shape: RoundedRectangleBorder(
                                            borderRadius:
                                                BorderRadius.circular(8),
                                          ),
                                          backgroundColor: Colors.red[200],
                                        ),
                                        child: const Text(
                                          'View Players',
                                          style: TextStyle(color: Colors.white),
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
                    ),
                  ),
                ),
    );
  }
}
