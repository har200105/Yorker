class Tournament {
  final String id;
  final String name;
  final DateTime startDate;
  final DateTime endDate;
  final String tournamentLogo;
  final String status;
  final bool isActive;

  Tournament({
    required this.id,
    required this.name,
    required this.startDate,
    required this.endDate,
    required this.tournamentLogo,
    required this.status,
    required this.isActive,
  });
}
