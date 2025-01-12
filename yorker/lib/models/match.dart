class Match {
  final String id;
  final String name;
  final String teamAId;
  final String teamBId;
  final DateTime date;
  final String status;
  final String venue;
  final String tournamentId;
  final Team teamA;
  final Team teamB;

  Match({
    required this.id,
    required this.name,
    required this.teamAId,
    required this.teamBId,
    required this.date,
    required this.status,
    required this.venue,
    required this.tournamentId,
    required this.teamA,
    required this.teamB,
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
      tournamentId: json['tournamentId'],
      teamA: Team.fromJson(json['teamA']),
      teamB: Team.fromJson(json['teamB']),
    );
  }
}

class Team {
  final String id;
  final String name;
  final String? logo;

  Team({required this.id, required this.name, this.logo});

  factory Team.fromJson(Map<String, dynamic> json) {
    return Team(id: json['id'], name: json['name'], logo: json['logo'] ?? '');
  }
}
