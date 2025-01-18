import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
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
      final response = await http.get(
        Uri.parse(
            'http://10.106.150.152:4002/api/v1/match/leader-board/${widget.matchId}'),
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

  void viewTeamPlayers(String teamId) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => TeamDetailsPage(teamId: teamId),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Match Leaderboard'),
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : leaderboard.isEmpty
              ? const Center(child: Text('No leaderboard data available'))
              : ListView.builder(
                  itemCount: leaderboard.length,
                  itemBuilder: (context, index) {
                    final item = leaderboard[index];
                    return Card(
                      child: ListTile(
                        title: Text(item['userName']),
                        subtitle: Text('Total Points: ${item['totalPoints']}'),
                        trailing: ElevatedButton(
                          onPressed: () => viewTeamPlayers(item['teamId']),
                          child: const Text('View Team Players'),
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}
