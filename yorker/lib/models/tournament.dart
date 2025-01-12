class Tournament {
  final String id;
  final String name;
  final String startDate;
  final String endDate;
  final String tournamentLogo;
  final String status;
  final bool isActive;
  final String createdAt;
  final String updatedAt;

  Tournament({
    required this.id,
    required this.name,
    required this.startDate,
    required this.endDate,
    required this.tournamentLogo,
    required this.status,
    required this.isActive,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Tournament.fromJson(Map<String, dynamic> json) {
    return Tournament(
      id: json['id'],
      name: json['name'],
      startDate: json['startDate'],
      endDate: json['endDate'],
      tournamentLogo: json['tournamentLogo'],
      status: json['status'],
      isActive: json['isActive'],
      createdAt: json['createdAt'],
      updatedAt: json['updatedAt'],
    );
  }
}
