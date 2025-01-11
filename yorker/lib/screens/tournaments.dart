import 'package:flutter/material.dart';
import 'package:yorker/models/tournament.dart';

class TournamentScreen extends StatelessWidget {
  final List<Tournament> tournaments = [
    Tournament(
      id: '1',
      name: 'Champions Trophy',
      startDate: DateTime(2025, 01, 01),
      endDate: DateTime(2025, 01, 31),
      tournamentLogo:
          'https://upload.wikimedia.org/wikipedia/en/1/18/2025_IPL_logo.png?20241001000050',
      status: 'upcoming',
      isActive: true,
    ),
    Tournament(
      id: '2',
      name: 'IPL 2025',
      startDate: DateTime(2024, 12, 01),
      endDate: DateTime(2025, 02, 28),
      tournamentLogo:
          'https://upload.wikimedia.org/wikipedia/en/1/18/2025_IPL_logo.png?20241001000050',
      status: 'ongoing',
      isActive: true,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Tournaments'),
          backgroundColor: Colors.tealAccent,
          elevation: 4,
          toolbarHeight: 56,
        ),
        body: Padding(
          padding: const EdgeInsets.all(16.0),
          child: ListView.builder(
            itemCount: tournaments.length,
            itemBuilder: (context, index) {
              final tournament = tournaments[index];
              return TournamentCard(tournament: tournament);
            },
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
            const SizedBox(height: 4),
            Text(
              'Status: ${tournament.status}',
              style: const TextStyle(fontSize: 14, color: Colors.grey),
            ),
            const SizedBox(height: 4),
            Text(
              'Start Date: ${tournament.startDate.toLocal()}'.split(' ')[0],
              style: const TextStyle(fontSize: 14, color: Colors.grey),
            ),
            Text(
              'End Date: ${tournament.endDate.toLocal()}'.split(' ')[0],
              style: const TextStyle(fontSize: 14, color: Colors.grey),
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                TextButton(
                  onPressed: () {
                    // Add action here
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
