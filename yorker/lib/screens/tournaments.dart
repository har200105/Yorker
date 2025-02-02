import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:yorker/models/tournament.dart';
import 'package:yorker/providers/tournament.provider.dart';
import 'package:yorker/repository/auth.local.repository.dart';
import 'package:yorker/screens/login.dart';
import 'package:yorker/screens/matches.dart';

class TournamentScreen extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final tournamentsAsyncValue = ref.watch(tournamentsProvider);

    return SafeArea(
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Tournaments'),
          backgroundColor: Colors.tealAccent,
          elevation: 4,
          toolbarHeight: 56,
          actions: [
            IconButton(
              icon: const Icon(Icons.logout, color: Colors.black),
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (context) => AlertDialog(
                    title: const Text('Logout'),
                    content: const Text('Are you sure you want to log out?'),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(context),
                        child: const Text('Cancel'),
                      ),
                      TextButton(
                        onPressed: () async {
                          await LocalStorage.clearToken();
                          print("cleared called");
                          if (context.mounted) {
                            Navigator.of(context).pushReplacement(
                                MaterialPageRoute(
                                    builder: (context) => LoginPage()));
                          }
                        },
                        child: const Text('Logout'),
                      ),
                    ],
                  ),
                );
              },
            ),
          ],
        ),
        body: Padding(
          padding: const EdgeInsets.all(16.0),
          child: tournamentsAsyncValue.when(
            data: (tournaments) => ListView.builder(
              itemCount: tournaments.length,
              itemBuilder: (context, index) {
                final tournament = tournaments[index];
                return TournamentCard(tournament: tournament);
              },
            ),
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (error, stackTrace) =>
                Center(child: Text('Error: ${error.toString()}')),
          ),
        ),
      ),
    );
  }
}

class TournamentCard extends StatelessWidget {
  final Tournament tournament;

  const TournamentCard({Key? key, required this.tournament}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(10),
      ),
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Image.network(
                  tournament.tournamentLogo,
                  height: 100,
                  width: 100,
                  fit: BoxFit.cover,
                ),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              tournament.name,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 8),
            Text(
              'Start Date: ${DateFormat('MMM dd yyyy').format(DateTime.parse(tournament.startDate))}',
              style: const TextStyle(fontSize: 14, color: Colors.grey),
            ),
            Text(
              'End Date: ${DateFormat('MMM dd yyyy').format(DateTime.parse(tournament.endDate))}',
              style: const TextStyle(fontSize: 14, color: Colors.grey),
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                TextButton(
                  onPressed: () {
                    Navigator.of(context).push(MaterialPageRoute(
                      builder: (context) =>
                          MatchListScreen(tournamentId: tournament.id),
                    ));
                  },
                  child: const Text('View matches'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
