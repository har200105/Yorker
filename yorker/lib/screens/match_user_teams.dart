import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:yorker/providers/user.team.provider.dart';
import 'package:yorker/screens/create_team.dart';
import 'package:yorker/screens/match_user_team_detail.dart';

class UserTeamsListPage extends ConsumerStatefulWidget {
  final String matchId;

  UserTeamsListPage({required this.matchId});

  @override
  _UserTeamsListPageState createState() => _UserTeamsListPageState();
}

class _UserTeamsListPageState extends ConsumerState<UserTeamsListPage> {
  late Future<List<Map<String, dynamic>>> _userTeams;
  String matchName = "";

  @override
  void initState() {
    super.initState();
    // _userTeams = _fetchUserTeams();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(userTeamProvider.notifier).fetchUserTeams(widget.matchId);
    });
  }

  @override
  Widget build(BuildContext context) {
    final userTeamState = ref.watch(userTeamProvider);
    print("called");
    if (userTeamState.isLoading) {
      return const Center(
        child: CircularProgressIndicator(
          color: Colors.tealAccent,
        ),
      );
    }
    if (userTeamState.userTeams.isEmpty) {
      return Scaffold(
        appBar: AppBar(
          title: Text('Your Teams'),
          centerTitle: true,
        ),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Text(
                  'You have not created any teams yet for this match',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w500,
                    color: Colors
                        .black, // Make sure the text color is set properly
                  ),
                ),
                SizedBox(height: 16),
                TextButton(
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
                        builder: (context) => CreateTeam(
                          matchId: widget.matchId,
                        ),
                      ),
                    );
                  },
                  child: const Text('Create Team'),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return Scaffold(
        appBar: AppBar(
          title: Text('Your Teams'),
          centerTitle: true,
        ),
        body: ListView.builder(
            itemCount: userTeamState.userTeams.length,
            itemBuilder: (context, index) {
              var team = userTeamState.userTeams[index];
              print(team);
              bool isScoredComputed = team.isScoredComputed ?? false;

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
                          teamId: team.id,
                        ),
                      ),
                    );
                  },
                  title: Text(
                    'Team #${team.id.split('-')[0]}',
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
                        matchName,
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
                                team.captain.name,
                                style: TextStyle(
                                    fontSize: 14, fontWeight: FontWeight.w400),
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
                                team.viceCaptain.name,
                                style: TextStyle(
                                    fontSize: 14, fontWeight: FontWeight.w400),
                              ),
                            ],
                          ),
                        ],
                      ),
                      SizedBox(height: 10),
                      if (isScoredComputed) ...[
                        Text(
                          'Points: ${team.pointsObtained}',
                          style: TextStyle(fontSize: 14),
                        ),
                        Text(
                          'Rank: ${team.leaderBoardRank}',
                          style: TextStyle(fontSize: 14),
                        ),
                        Text(
                          'Status: ${team.match.status}',
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
                                        teamId: team.id,
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
            }));
  }
}
