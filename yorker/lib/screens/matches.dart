import 'package:flutter/material.dart';
import 'package:yorker/models/match.dart';

class MatchListScreen extends StatefulWidget {
  final String tournamentId;

  const MatchListScreen({Key? key, required this.tournamentId})
      : super(key: key);

  @override
  State<MatchListScreen> createState() => _MatchListScreenState();
}

class _MatchListScreenState extends State<MatchListScreen> {
  late Future<List<Match>> _matches;

  Future<List<Match>> fetchMatches() async {
    final List<Match> dummyMatches = [
      Match(
        name: 'Match 1',
        venue: 'Stadium A',
        date: DateTime.now().add(const Duration(days: 1)),
        status: 'Upcoming',
      ),
      Match(
        name: 'Match 2',
        venue: 'Stadium B',
        date: DateTime.now().add(const Duration(days: 2)),
        status: 'Upcoming',
      ),
      Match(
        name: 'Match 3',
        venue: 'Stadium C',
        date: DateTime.now().subtract(const Duration(days: 1)),
        status: 'Completed',
      ),
    ];
    // Simulate a network delay
    await Future.delayed(const Duration(seconds: 1));
    return dummyMatches;
  }

  @override
  void initState() {
    super.initState();
    _matches = fetchMatches();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Matches'),
      ),
      body: FutureBuilder<List<Match>>(
        future: _matches,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(
              child: CircularProgressIndicator(
                color: Colors.tealAccent,
              ),
            );
          } else if (snapshot.hasError) {
            return Center(
              child: Text('Error: ${snapshot.error}'),
            );
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(
              child: Text('No matches found'),
            );
          }

          final matches = snapshot.data!;
          return ListView.builder(
            itemCount: matches.length,
            itemBuilder: (context, index) {
              final match = matches[index];
              return Card(
                margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
                child: ListTile(
                  title: Text(match.name),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Venue: ${match.venue}'),
                      Text('Date: ${match.date.toLocal()}'),
                      Text('Status: ${match.status}'),
                    ],
                  ),
                  trailing: const Icon(Icons.arrow_forward_ios),
                  onTap: () {
                    // Handle match click (e.g., navigate to match details)
                  },
                ),
              );
            },
          );
        },
      ),
    );
  }
}
