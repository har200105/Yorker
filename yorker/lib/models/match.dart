import 'package:yorker/models/player.dart';
import 'package:yorker/models/team.dart';

class Match {
  final String id;
  final String name;
  final String teamAId;
  final String teamBId;
  final DateTime date;
  final String status;
  final String venue;
  final bool isCompleted;
  final String tournamentId;
  final Team teamA;
  final Team teamB;
  final List<Player>? players;

  Match({
    required this.id,
    required this.name,
    required this.teamAId,
    required this.teamBId,
    required this.date,
    required this.status,
    this.isCompleted = false,
    required this.venue,
    required this.tournamentId,
    required this.teamA,
    required this.teamB,
    this.players,
  });

  factory Match.fromJson(Map<String, dynamic> json) {
    return Match(
      id: json['id'],
      name: json['name'],
      teamAId: json['teamAId'],
      teamBId: json['teamBId'],
      date: DateTime.parse(json['date']),
      status: json['status'],
      venue: json['venue'],
      isCompleted: json['isCompleted'] ?? false,
      tournamentId: json['tournamentId'],
      teamA: Team.fromJson(json['teamA']),
      teamB: Team.fromJson(json['teamB']),
      players: json['players'] != null
          ? (json['players'] as List)
              .map((playerJson) => Player.fromJson(playerJson))
              .toList()
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'teamAId': teamAId,
      'teamBId': teamBId,
      'date': date.toIso8601String(),
      'status': status,
      'venue': venue,
      'isCompleted': isCompleted,
      'tournamentId': tournamentId,
      'teamA': teamA.toJson(),
      'teamB': teamB.toJson(),
      'players': players?.map((player) => player.toJson()).toList(),
    };
  }
}
