import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:fluttertoast/fluttertoast.dart';
import 'package:intl/intl.dart';
import 'package:yorker/repository/auth.local.repository.dart';
import 'package:yorker/screens/match_user_teams.dart';

extension StringCapExtension on String {
  String capitalizeFirstLetter() {
    if (isEmpty) {
      return this;
    }
    return this[0].toUpperCase() + substring(1).toLowerCase();
  }
}

class CreateTeam extends StatefulWidget {
  final String matchId;

  const CreateTeam({super.key, required this.matchId});

  @override
  _CreateTeamState createState() => _CreateTeamState();
}

class _CreateTeamState extends State<CreateTeam> with TickerProviderStateMixin {
  late TabController _tabController;

  String matchName = "";
  String venue = "";
  String date = "";

  int userCredits = 100;
  final int totalCredits = 100;
  int selectedPlayersCount = 0;

  Map<String, List<Map<String, dynamic>>> teamPlayers = {};
  Map<String, bool> selectedPlayers = {};
  String? captainId;
  String? viceCaptainId;
  Map<String, dynamic>? teamA;
  Map<String, dynamic>? teamB;

  @override
  void initState() {
    super.initState();
    fetchMatchDetails();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> createTeam() async {
    if (!isTeamComplete) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            "Team is not complete. Please select 11 players, a captain, and a vice-captain.",
          ),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    List<String> playerIds = selectedPlayers.entries
        .where((entry) => entry.value == true)
        .map((entry) => entry.key)
        .toList();

    Map<String, dynamic> payload = {
      "players": playerIds,
      "captainId": captainId,
      "viceCaptainId": viceCaptainId,
    };

    try {
      final String? token = await LocalStorage.getToken();
      final response = await http.post(
        Uri.parse(
            'http://13.127.41.3/api/v1/user-team/create/${widget.matchId}'),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token"
        },
        body: json.encode(payload),
      );

      print(response.statusCode);

      if (response.statusCode == 200 || response.statusCode == 201) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Team created successfully!"),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.of(context).pushReplacement(MaterialPageRoute(
            builder: (context) => UserTeamsListPage(matchId: widget.matchId)));
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Failed to create team: ${response.body}"),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("An error occurred: $e"),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Future<void> fetchMatchDetails() async {
    final response = await http.get(Uri.parse(
        'http://13.127.41.3/api/v1/match/all-players/${widget.matchId}'));

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      setState(() {
        matchName = data['matchName'];
        venue = data['venue'];
        date = data['date'];
        teamA = data['teamA'];
        teamB = data['teamB'];

        teamPlayers = {
          data['teamA']['name']: List<Map<String, dynamic>>.from(
              data['players'][data['teamA']['name']]),
          data['teamB']['name']: List<Map<String, dynamic>>.from(
              data['players'][data['teamB']['name']]),
        };

        _tabController =
            TabController(length: teamPlayers.keys.length, vsync: this);
      });
    } else {
      throw Exception('Failed to load match details');
    }
  }

  void showSnackbar(BuildContext context, String message) {
    final snackBar = SnackBar(
      content: Text(message),
      duration: Duration(seconds: 1),
    );
    ScaffoldMessenger.of(context).showSnackBar(snackBar);
  }

  bool get isTeamComplete {
    return selectedPlayers.length == 11 &&
        captainId != null &&
        viceCaptainId != null;
  }

  bool canAddPlayer(String playerId, int credits) {
    List teamAPlayerIds =
        teamPlayers[teamA!['name']]?.map((player) => player['id']).toList() ??
            [];
    List teamBPlayerIds =
        teamPlayers[teamB!['name']]?.map((player) => player['id']).toList() ??
            [];

    bool isTeamAPlayer = teamAPlayerIds.contains(playerId);
    bool isTeamBPlayer = teamBPlayerIds.contains(playerId);

    int teamAPlayers = selectedPlayers.keys
        .where((key) => teamAPlayerIds.contains(key))
        .length;
    int teamBPlayers = selectedPlayers.keys
        .where((key) => teamBPlayerIds.contains(key))
        .length;

    if (isTeamAPlayer) {
      return selectedPlayers.length < 11 &&
          teamAPlayers < 7 &&
          userCredits >= credits;
    } else if (isTeamBPlayer) {
      return selectedPlayers.length < 11 &&
          teamBPlayers < 7 &&
          userCredits >= credits;
    }

    return false;
  }

  String getFormattedPlayerName(String name) {
    List<String> nameParts = name.split(' ');
    if (nameParts.length < 2) return name;
    return '${nameParts[0][0]}.${nameParts[1]}';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Create Your Fantasy Team'),
      ),
      body: teamPlayers.isEmpty
          ? Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              child: Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.all(12.0),
                    child: Card(
                      elevation: 5,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10)),
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Image.network(
                                  teamA?['logo'] ?? '', // Display team A logo
                                  height: 30, // Adjust size as needed
                                ),
                                SizedBox(width: 8),
                                Text(
                                  "VS", // Between the two teams
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                SizedBox(width: 8),
                                Image.network(
                                  teamB?['logo'] ?? '', // Display team B logo
                                  height: 30, // Adjust size as needed
                                ),
                              ],
                            ),
                            SizedBox(height: 4),
                            Row(
                              children: [
                                Icon(Icons.location_on, size: 16),
                                SizedBox(width: 4),
                                Text(
                                  "$venue | ${DateFormat('MMMM dd, yyyy').format(DateTime.parse(date))}",
                                  style: TextStyle(color: Colors.grey),
                                ),
                              ],
                            ),
                            SizedBox(height: 8),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  "Remaining Credits: $userCredits",
                                  style: TextStyle(
                                      color: Colors.green,
                                      fontWeight: FontWeight.w600),
                                ),
                                Text(
                                  "Selected Players: ${selectedPlayers.length}",
                                  style: TextStyle(fontWeight: FontWeight.w600),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  TabBar(
                    controller: _tabController,
                    labelColor: Colors.black,
                    indicatorColor: Colors.blue,
                    tabs: teamPlayers.keys
                        .map((teamName) => Tab(text: teamName))
                        .toList(),
                  ),
                  SizedBox(height: 8),
                  Container(
                    height: MediaQuery.of(context).size.height * 0.6,
                    child: TabBarView(
                      controller: _tabController,
                      children: teamPlayers.keys.map((teamName) {
                        final players = teamPlayers[teamName]!;
                        return ListView.builder(
                          itemCount: players.length,
                          itemBuilder: (context, index) {
                            final player = players[index];
                            final isSelected =
                                selectedPlayers[player['id']] ?? false;
                            final isCaptain = player['id'] == captainId;
                            final isViceCaptain = player['id'] == viceCaptainId;
                            return Card(
                              margin: EdgeInsets.all(8),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                                side: BorderSide(
                                  color:
                                      isSelected || isCaptain || isViceCaptain
                                          ? Colors.blue
                                          : Colors.transparent,
                                  width: 2,
                                ),
                              ),
                              child: Container(
                                padding: EdgeInsets.all(12),
                                child: ListTile(
                                  contentPadding: EdgeInsets.symmetric(
                                      vertical: 8, horizontal: 0),
                                  leading: CircleAvatar(
                                    radius: 30,
                                    backgroundImage:
                                        NetworkImage(player['photo']),
                                  ),
                                  title: Text(
                                    getFormattedPlayerName(player['name']),
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16,
                                    ),
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  subtitle: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        "${player['role'].toString().capitalizeFirstLetter()}",
                                        style: TextStyle(
                                          color: Colors.grey[600],
                                          fontSize: 14,
                                        ),
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                      Text(
                                        "${player['credits']} Credits",
                                        style: TextStyle(
                                          color: Colors.grey[600],
                                          fontSize: 14,
                                        ),
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ],
                                  ),
                                  trailing: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      TextButton(
                                        onPressed: () {
                                          setState(() {
                                            if (captainId == player['id']) {
                                              captainId = null;
                                              userCredits +=
                                                  player['credits'] as int;
                                            } else {
                                              captainId = player['id'];
                                              if (viceCaptainId ==
                                                  player['id']) {
                                                viceCaptainId = null;
                                              }
                                              if (!(selectedPlayers[
                                                      player['id']] ??
                                                  false)) {
                                                selectedPlayers[player['id']] =
                                                    true;
                                                userCredits -=
                                                    player['credits'] as int;
                                              }
                                            }
                                          });
                                        },
                                        style: TextButton.styleFrom(
                                          foregroundColor: isCaptain
                                              ? Colors.blue
                                              : Colors.grey,
                                        ),
                                        child: Text("C"),
                                      ),
                                      TextButton(
                                        onPressed: () {
                                          setState(() {
                                            if (viceCaptainId == player['id']) {
                                              viceCaptainId = null;
                                              userCredits +=
                                                  player['credits'] as int;
                                            } else {
                                              viceCaptainId = player['id'];
                                              if (captainId == player['id']) {
                                                captainId = null;
                                              }
                                              if (!(selectedPlayers[
                                                      player['id']] ??
                                                  false)) {
                                                selectedPlayers[player['id']] =
                                                    true;
                                                userCredits -=
                                                    player['credits'] as int;
                                              }
                                            }
                                          });
                                        },
                                        style: TextButton.styleFrom(
                                          foregroundColor: isViceCaptain
                                              ? Colors.green
                                              : Colors.grey,
                                        ),
                                        child: Text("VC"),
                                      ),
                                      SizedBox(width: 8),
                                      IconButton(
                                        icon: Icon(
                                          isSelected ? Icons.remove : Icons.add,
                                          color: Colors.green,
                                        ),
                                        onPressed: () {
                                          setState(() {
                                            if (isSelected) {
                                              selectedPlayers
                                                  .remove(player['id']);
                                              userCredits +=
                                                  player['credits'] as int;
                                              if (viceCaptainId ==
                                                  player['id']) {
                                                setState(() {
                                                  viceCaptainId = null;
                                                });
                                              }
                                              if (captainId == player['id']) {
                                                setState(() {
                                                  captainId = null;
                                                });
                                              }
                                            } else if (canAddPlayer(
                                                player['id'],
                                                player['credits'])) {
                                              selectedPlayers[player['id']] =
                                                  true;
                                              userCredits -=
                                                  player['credits'] as int;
                                            } else if (userCredits >=
                                                player['credits']) {
                                              print(player);
                                              showSnackbar(context,
                                                  "Max players from a team reached!");
                                            } else {
                                              showSnackbar(context,
                                                  "Not enough credits!");
                                            }
                                          });
                                        },
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            );
                          },
                        );
                      }).toList(),
                    ),
                  ),
                ],
              ),
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: isTeamComplete
            ? () async {
                await createTeam();
              }
            : () {
                if (selectedPlayers.length != 11) {
                  Fluttertoast.showToast(
                      msg: "Select 11 players",
                      toastLength: Toast.LENGTH_SHORT,
                      gravity: ToastGravity.BOTTOM);
                  return;
                }
                if (captainId == null) {
                  Fluttertoast.showToast(
                      msg: "Assign a player as captain",
                      toastLength: Toast.LENGTH_SHORT,
                      gravity: ToastGravity.BOTTOM);
                  return;
                }
                if (viceCaptainId == null) {
                  Fluttertoast.showToast(
                      msg: "Assign a player as Vice-Captain!",
                      toastLength: Toast.LENGTH_SHORT,
                      gravity: ToastGravity.BOTTOM);
                }
              },
        backgroundColor: isTeamComplete ? Colors.blue : Colors.grey,
        child: Icon(
          Icons.check,
        ),
      ),
    );
  }
}
