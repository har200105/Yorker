import 'package:yorker/models/team.dart';

class Player {
  final String id;
  final String name;
  final String teamId;
  final String role;
  final int credits;
  final String photo;
  final DateTime createdAt;
  final DateTime updatedAt;
  final Team team;

  Player({
    required this.id,
    required this.name,
    required this.teamId,
    required this.role,
    required this.credits,
    required this.photo,
    required this.createdAt,
    required this.updatedAt,
    required this.team,
  });

  factory Player.fromJson(Map<String, dynamic> json) {
    return Player(
      id: json['id'],
      name: json['name'],
      teamId: json['teamId'],
      role: json['role'],
      credits: json['credits'],
      photo: json['photo'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      team: Team.fromJson(json['team']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'teamId': teamId,
      'role': role,
      'credits': credits,
      'photo': photo,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'team': team.toJson(),
    };
  }
}
