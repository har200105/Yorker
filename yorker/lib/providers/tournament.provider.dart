import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:yorker/models/tournament.dart';
import 'package:yorker/repository/tournament.repository.dart';

final tournamentRepositoryProvider = Provider((ref) {
  return TournamentRepository(baseUrl: 'http://10.106.150.152:4002');
});

final tournamentsProvider = FutureProvider<List<Tournament>>((ref) async {
  final repository = ref.read(tournamentRepositoryProvider);
  return repository.fetchTournaments();
});
