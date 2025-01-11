class Match {
  final String name;
  final String venue;
  final DateTime date;
  final String status;

  Match({
    required this.name,
    required this.venue,
    required this.date,
    required this.status,
  });

  factory Match.fromJson(Map<String, dynamic> json) {
    return Match(
      name: json['name'],
      venue: json['venue'],
      date: DateTime.parse(json['date']),
      status: json['status'],
    );
  }
}
