import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:yorker/constants.dart';
import 'package:yorker/models/user_team.dart';
import 'package:yorker/repository/user.team.repository.dart';

final userTeamRepositoryProvider = Provider((ref) {
  return UserTeamRepository(baseUrl: baseUrl);
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

  Future<void> fetchPlayersByTeamId(String teamId) async {
    try {
      state = state.copyWith(isLoading: true, error: null);
      final userTeam = await repository.fetchPlayersByTeamId(teamId);
      final updateUserTeams = state.userTeams.map((m) {
        if (m.id == teamId) {
          return userTeam;
        }
        return m;
      }).toList();
      state = state.copyWith(userTeams: updateUserTeams, isLoading: false);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  UserTeam getUserTeamById(String teamId) {
    try {
      final match = state.userTeams.firstWhere((m) => m.id == teamId,
          orElse: () => throw Exception("User Team not found"));
      return match;
    } catch (e) {
      throw Exception("Error fetching user team: $e");
    }
  }
}

final userTeamProvider =
    StateNotifierProvider<UserTeamNotifier, UserTeamState>((ref) {
  final repository = ref.read(userTeamRepositoryProvider);
  return UserTeamNotifier(repository);
});
