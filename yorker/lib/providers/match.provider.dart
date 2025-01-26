import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:yorker/models/match.dart';
import 'package:yorker/repository/match.repository.dart';

final matchRepositoryProvider = Provider((ref) {
  return MatchRepository(baseUrl: 'http://13.127.41.3');
});

final matchesProvider =
    FutureProvider.family<List<Match>, String>((ref, tournamentId) async {
  final repository = ref.read(matchRepositoryProvider);
  return repository.fetchMatches(tournamentId);
});
