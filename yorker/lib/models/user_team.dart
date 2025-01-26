import 'package:yorker/models/match.dart';
import 'package:yorker/models/userTeamPlayer.dart';

class UserTeam {
  final String id;
  final Match match;
  final UserTeamPlayer? viceCaptain;
  final UserTeamPlayer? captain;
  final bool? isScoredComputed;
  final int? pointsObtained;
  final int? leaderBoardRank;
  final List<UserTeamPlayer>? players;

  const UserTeam(
      {required this.id,
      required this.match,
      required this.viceCaptain,
      required this.captain,
      this.isScoredComputed,
      this.pointsObtained,
      required this.players,
      this.leaderBoardRank});

  factory UserTeam.fromJson(Map<String, dynamic> map) {
    return UserTeam(
      id: map['id'] as String,
      match: Match.fromJson(map['match'] as Map<String, dynamic>),
      viceCaptain: map['viceCaptain'] != null
          ? UserTeamPlayer.fromJson(map['viceCaptain'] as Map<String, dynamic>)
          : null,
      captain: map['captain'] != null
          ? UserTeamPlayer.fromJson(map['captain'] as Map<String, dynamic>)
          : null,
      isScoredComputed: map['isScoredComputed'] as bool?,
      leaderBoardRank: map['leaderBoardRank'] as int?,
      pointsObtained: map['pointsObtained'] as int?,
      players: map['players'] != null
          ? (map['players'] as List)
              .map((playerJson) => UserTeamPlayer.fromJson(playerJson))
              .toList()
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'match': match.toJson(),
      'viceCaptain': viceCaptain!.toJson(),
      'captain': captain!.toJson(),
      'isScoredComputed': isScoredComputed,
      'pointsObtained': pointsObtained,
      'leaderBoardRank': leaderBoardRank,
      'players': players?.map((player) => player.toJson()).toList(),
    };
  }
}


// "id": "c3f77a5e-239f-42d5-8f1b-39499577d50b",
//             "userTeamId": "e6ce0336-de6d-45d1-999e-9390e493cca8",
//             "playerId": "ac0b28c5-c60b-4c14-88ac-4e7b47f674af",
//             "isCaptain": false,
//             "isViceCaptain": true,
//             "runs": 0,
//             "wickets": 0,
//             "isPlayed": false,
//             "points": 0,
//             "createdAt": "2025-01-25T11:33:23.446Z",
//             "updatedAt": "2025-01-25T11:33:23.446Z",
//             "player": {
//                 "id": "ac0b28c5-c60b-4c14-88ac-4e7b47f674af",
//                 "name": "Jasprit Bumrah",
//                 "teamId": "367cf8d4-f114-4ad7-9516-15fb5d5cd7a0",
//                 "role": "bowler",
//                 "credits": 10,
//                 "photo": "https://static.cricbuzz.com/a/img/v1/152x152/i1/c591949/jasprit-bumrah.jpg",
//                 "createdAt": "2025-01-24T20:35:20.624Z",
//                 "updatedAt": "2025-01-24T20:35:20.624Z",
//                 "team": {
//                     "id": "367cf8d4-f114-4ad7-9516-15fb5d5cd7a0",
//                     "name": "India",
//                     "players": [],
//                     "logo": "https://upload.wikimedia.org/wikipedia/mai/1/11/India_national_cricket_team.png?20180317123159",
//                     "createdAt": "2025-01-24T20:35:20.622Z",
//                     "updatedAt": "2025-01-24T20:35:20.622Z"
//                 }

  //  "id": "aa16ae25-86c8-416c-8971-1f1471116943",
  //           "userTeamId": "e6ce0336-de6d-45d1-999e-9390e493cca8",
  //           "playerId": "deba44eb-1c8b-4934-97e6-3abe12a6ff7b",
  //           "isCaptain": true,
  //           "isViceCaptain": false,
  //           "runs": 0,
  //           "wickets": 0,
  //           "isPlayed": false,
  //           "points": 0,
  //           "createdAt": "2025-01-25T11:33:23.446Z",
  //           "updatedAt": "2025-01-25T11:33:23.446Z",
  //           "player": {
  //               "id": "deba44eb-1c8b-4934-97e6-3abe12a6ff7b",
  //               "name": "Virat Kohli",
  //               "teamId": "367cf8d4-f114-4ad7-9516-15fb5d5cd7a0",
  //               "role": "batsman",
  //               "credits": 10,
  //               "photo": "https://static.cricbuzz.com/a/img/v1/152x152/i1/c591944/virat-kohli.jpg",
  //               "createdAt": "2025-01-24T20:35:20.624Z",
  //               "updatedAt": "2025-01-24T20:35:20.624Z",
  //               "team": {
  //                   "id": "367cf8d4-f114-4ad7-9516-15fb5d5cd7a0",
  //                   "name": "India",
  //                   "players": [],
  //                   "logo": "https://upload.wikimedia.org/wikipedia/mai/1/11/India_national_cricket_team.png?20180317123159",
  //                   "createdAt": "2025-01-24T20:35:20.622Z",
  //                   "updatedAt": "2025-01-24T20:35:20.622Z"
  //               }