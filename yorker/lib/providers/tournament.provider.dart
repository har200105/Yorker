import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:yorker/models/tournament.dart';
import 'package:yorker/repository/tournament.repository.dart';

final tournamentRepositoryProvider = Provider((ref) {
  return TournamentRepository(baseUrl: 'http://13.127.41.3');
});

final tournamentsProvider = FutureProvider<List<Tournament>>((ref) async {
  final repository = ref.read(tournamentRepositoryProvider);
  return repository.fetchTournaments();
});
