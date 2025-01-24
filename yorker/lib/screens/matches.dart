import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:yorker/providers/match.provider.dart';
import 'package:yorker/screens/create_team.dart';
import 'package:yorker/screens/match_leader_board.dart';
import 'package:yorker/screens/match_user_teams.dart';

class MatchListScreen extends ConsumerWidget {
  final String tournamentId;

  const MatchListScreen({Key? key, required this.tournamentId})
      : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final matchesAsyncValue = ref.watch(matchesProvider(tournamentId));

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Matches',
          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
        ),
        centerTitle: true,
        elevation: 0,
      ),
      body: matchesAsyncValue.when(
        data: (matches) {
          if (matches.isEmpty) {
            return const Center(child: Text('No matches found'));
          }
          return ListView.builder(
            itemCount: matches.length,
            itemBuilder: (context, index) {
              final match = matches[index];
              return Card(
                margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
                elevation: 10,
                shadowColor: Colors.black.withOpacity(0.2),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        match.name,
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.teal,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Image.network(
                            match.teamA.logo!,
                            width: 40,
                            height: 40,
                            fit: BoxFit.cover,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            'vs',
                            style: TextStyle(
                                color: Colors.deepPurple, fontSize: 16),
                          ),
                          const SizedBox(width: 8),
                          Image.network(
                            match.teamB.logo!,
                            width: 40,
                            height: 40,
                            fit: BoxFit.cover,
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Venue: ${match.venue}',
                        style: TextStyle(color: Colors.grey[700]),
                      ),
                      Text(
                        'Date: ${DateFormat('MMM dd, yyyy').format(match.date)}',
                        style: TextStyle(color: Colors.grey[700]),
                      ),
                      Text(
                        'Status: ${match.status.toUpperCase()}',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: match.status == 'scheduled'
                              ? Colors.green
                              : Colors.red,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          if (match.isCompleted == true)
                            Expanded(
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
                                        builder: (context) => CreateTeam(
                                              matchId: match.id,
                                            )),
                                  );
                                },
                                child: const Text('Create Team'),
                              ),
                            ),
                          if (match.isCompleted == false)
                            Expanded(
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
                                        builder: (context) => MatchLeaderBoard(
                                              matchId: match.id,
                                            )),
                                  );
                                },
                                child: const Text('Leaderboard'),
                              ),
                            ),
                          Expanded(
                            child: TextButton(
                              style: TextButton.styleFrom(
                                foregroundColor: Colors.white,
                                backgroundColor: Colors.deepPurple,
                                padding: const EdgeInsets.symmetric(
                                    vertical: 12, horizontal: 24),
                              ),
                              onPressed: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                      builder: (context) => UserTeamsListPage(
                                            matchId: match.id,
                                          )),
                                );
                              },
                              child: const Text('View My Teams'),
                            ),
                          ),
                        ],
                      )
                    ],
                  ),
                ),
              );
            },
          );
        },
        loading: () => const Center(
          child: CircularProgressIndicator(
            color: Colors.tealAccent,
          ),
        ),
        error: (error, stackTrace) => Center(
          child: Text('Error: $error'),
        ),
      ),
    );
  }
}
