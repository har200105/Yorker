import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:yorker/constants.dart';
import 'package:yorker/models/match.dart';
import 'package:yorker/repository/match.repository.dart';

final matchRepositoryProvider = Provider((ref) {
  return MatchRepository(baseUrl: baseUrl);
});

class MatchState {
  final bool isLoading;
  final List<Match> matches;
  final String? error;

  MatchState({
    this.isLoading = false,
    this.matches = const [],
    this.error,
  });

  MatchState copyWith({
    bool? isLoading,
    List<Match>? matches,
    String? error,
  }) {
    return MatchState(
      isLoading: isLoading ?? this.isLoading,
      matches: matches ?? this.matches,
      error: error,
    );
  }
}

class MatchNotifier extends StateNotifier<MatchState> {
  final MatchRepository repository;

  MatchNotifier(this.repository) : super(MatchState());

  Future<void> fetchMatches(String tournamentId) async {
    try {
      state = state.copyWith(isLoading: true, error: null);
      final matches = await repository.fetchMatches(tournamentId);
      state = state.copyWith(matches: matches, isLoading: false);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  Future<void> fetchPlayers(String matchId) async {
    try {
      print("called");
      state = state.copyWith(isLoading: true, error: null);

      final matchWithPlayers = await repository.fetchMatchById(matchId);
      print("object");
      print(matchWithPlayers.players);
      print("matchWithPlayers");

      final updatedMatches = state.matches.map((m) {
        if (m.id == matchId) {
          return matchWithPlayers;
        }
        return m;
      }).toList();
      print("done");

      state = state.copyWith(matches: updatedMatches, isLoading: false);
    } catch (e) {
      print("Error : $e");
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  Match getMatchById(String matchId) {
    try {
      final match = state.matches.firstWhere((m) => m.id == matchId,
          orElse: () => throw Exception("Match not found"));
      return match;
    } catch (e) {
      throw Exception("Error fetching match: $e");
    }
  }
}

final matchNotifierProvider =
    StateNotifierProvider<MatchNotifier, MatchState>((ref) {
  final repository = ref.read(matchRepositoryProvider);
  return MatchNotifier(repository);
});
