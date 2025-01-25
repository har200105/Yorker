import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:yorker/models/match.dart';
import 'package:yorker/models/user_team.dart';
import 'package:yorker/repository/match.repository.dart';
import 'package:yorker/repository/user.team.repository.dart';

final userTeamRepositoryProvider = Provider((ref) {
  return UserTeamRepository(baseUrl: 'http://10.106.150.152:4002');
});

class UserTeamState {
  final bool isLoading;
  final List<UserTeam> userTeams;
  final String? error;

  UserTeamState({
    this.isLoading = false,
    this.userTeams = const [],
    this.error,
  });

  UserTeamState copyWith({
    bool? isLoading,
    List<UserTeam>? userTeams,
    String? error,
  }) {
    return UserTeamState(
      isLoading: isLoading ?? this.isLoading,
      userTeams: userTeams ?? this.userTeams,
      error: error,
    );
  }
}

class UserTeamNotifier extends StateNotifier<UserTeamState> {
  final UserTeamRepository repository;

  UserTeamNotifier(this.repository) : super(UserTeamState());

  Future<void> fetchUserTeams(String matchId) async {
    try {
      state = state.copyWith(isLoading: true, error: null);
      final userTeams = await repository.fetchUserTeams(matchId);
      state = state.copyWith(userTeams: userTeams, isLoading: false);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  // Future<void> fetchPlayers(String matchId) async {
  //   try {
  //     print("called");
  //     state = state.copyWith(isLoading: true, error: null);

  //     final matchWithPlayers = await repository.fetchMatchById(matchId);
  //     print("object");
  //     print(matchWithPlayers.players);
  //     print("matchWithPlayers");

  //     final updatedMatches = state.userTeams.map((m) {
  //       if (m.id == matchId) {
  //         return matchWithPlayers;
  //       }
  //       return m;
  //     }).toList();
  //     print("done");

  //     state = state.copyWith(matches: updatedMatches, isLoading: false);
  //   } catch (e) {
  //     print("Error : $e");
  //     state = state.copyWith(error: e.toString(), isLoading: false);
  //   }
  // }

  // Match getMatchById(String matchId) {
  //   try {
  //     final match = state.matches.firstWhere((m) => m.id == matchId,
  //         orElse: () => throw Exception("Match not found"));
  //     return match;
  //   } catch (e) {
  //     throw Exception("Error fetching match: $e");
  //   }
  // }
}

final userTeamProvider =
    StateNotifierProvider<UserTeamNotifier, UserTeamState>((ref) {
  final repository = ref.read(userTeamRepositoryProvider);
  return UserTeamNotifier(repository);
});
