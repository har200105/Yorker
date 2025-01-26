import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:yorker/providers/user.team.provider.dart';

class TeamDetailsPage extends ConsumerStatefulWidget {
  final String teamId;

  const TeamDetailsPage({super.key, required this.teamId});

  @override
  _TeamDetailsPageState createState() => _TeamDetailsPageState();
}

class _TeamDetailsPageState extends ConsumerState<TeamDetailsPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(userTeamProvider.notifier).fetchPlayersByTeamId(widget.teamId);
    });
  }

  @override
  Widget build(BuildContext context) {
    final userTeamState = ref.watch(userTeamProvider);

    if (userTeamState.isLoading) {
      return const Center(
        child: CircularProgressIndicator(
          color: Colors.tealAccent,
        ),
      );
    }

    final userTeam =
        ref.watch(userTeamProvider.notifier).getUserTeamById(widget.teamId);

    if (userTeam.players == null) {
      return const Center(
        child: CircularProgressIndicator(
          color: Colors.tealAccent,
        ),
      );
    }

    return Scaffold(
        appBar: AppBar(title: const Text("Team Details")),
        body: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 20),
              if (userTeam.isScoredComputed == true)
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Points Obtained: ${userTeam.pointsObtained}',
                      style: const TextStyle(fontSize: 16),
                    ),
                    Text(
                      'Leaderboard Rank: ${userTeam.leaderBoardRank}',
                      style: const TextStyle(fontSize: 16),
                    ),
                  ],
                ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 16),
                  if (userTeam.isScoredComputed == false)
                    const Text(
                      'Match is yet to complete.',
                      style: TextStyle(color: Colors.red, fontSize: 16),
                    ),
                  Text(
                    'Match Name: ${userTeam.match.name}',
                    style: const TextStyle(fontSize: 16),
                  ),
                  Text(
                    'Venue: ${userTeam.match.venue}',
                    style: const TextStyle(fontSize: 16),
                  ),
                  Text(
                    'Date: ${DateFormat('MMM dd yyyy').format(userTeam.match.date)}',
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
                  itemCount: userTeam.players!.length,
                  itemBuilder: (context, index) {
                    var player = userTeam.players![index];
                    return Card(
                      elevation: 4,
                      margin: const EdgeInsets.symmetric(vertical: 8),
                      child: ListTile(
                        title: Text(player.player.name),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                                'Role: ${player.player.role} | Credits: ${player.player.credits}'),
                            if (userTeam.isScoredComputed == true)
                              Text('Points: ${player.points}'),
                          ],
                        ),
                        trailing: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            if (player.isCaptain ?? false)
                              const Text('Captain',
                                  style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      color: Colors.green)),
                            if (player.isViceCaptain ?? false)
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
        ));
  }
}
