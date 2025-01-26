import 'package:yorker/models/match.dart';
import 'package:yorker/models/player.dart';

class UserTeam {
  final String id;
  final Match match;
  final Player viceCaptain;
  final Player captain;
  final bool? isScoredComputed;
  final int? pointsObtained;
  final int? leaderBoardRank;
  // final List<Player>? players;

  const UserTeam(
      {required this.id,
      required this.match,
      required this.viceCaptain,
      required this.captain,
      this.isScoredComputed,
      this.pointsObtained,
      // required this.players,
      this.leaderBoardRank});

  factory UserTeam.fromJson(Map<String, dynamic> map) {
    return UserTeam(
      id: map['id'] as String,
      match: Match.fromJson(map['match'] as Map<String, dynamic>),
      viceCaptain: Player.fromJson(map['viceCaptain'] as Map<String, dynamic>),
      captain: Player.fromJson(map['captain'] as Map<String, dynamic>),
      isScoredComputed: map['isScoredComputed'] as bool?,
      leaderBoardRank: map['leaderBoardRank'] as int?,
      pointsObtained: map['totalPoints'] as int?,
      // players: map['players'] != null
      //     ? (map['players'] as List)
      //         .map((playerJson) => Player.fromJson(playerJson))
      //         .toList()
      // : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'match': match.toJson(),
      'viceCaptain': viceCaptain.toJson(),
      'captain': captain.toJson(),
      'isScoredComputed': isScoredComputed,
      'totalPoints': pointsObtained,
      'leaderBoardRank': leaderBoardRank,
      // 'players': players?.map((player) => player.toJson()).toList(),
    };
  }
}
