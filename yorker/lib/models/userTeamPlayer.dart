import 'package:yorker/models/player.dart';

class UserTeamPlayer {
  final String id;
  final int? points;
  final bool? isCaptain;
  final bool? isViceCaptain;
  final DateTime createdAt;
  final DateTime updatedAt;
  final Player player;

  UserTeamPlayer(
      {required this.id,
      this.isCaptain,
      this.isViceCaptain,
      this.points,
      required this.createdAt,
      required this.updatedAt,
      required this.player});

  factory UserTeamPlayer.fromJson(Map<String, dynamic> json) {
    return UserTeamPlayer(
        id: json['id'],
        createdAt: DateTime.parse(json['createdAt']),
        updatedAt: DateTime.parse(json['updatedAt']),
        points: json['points'],
        isCaptain: json['isCaptain'],
        isViceCaptain: json['isViceCaptain'],
        player: Player.fromJson(json['player']));
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'points': points,
      'isCaptain': isCaptain,
      'isViceCaptain': isViceCaptain,
      'player': player.toJson(),
    };
  }
}
