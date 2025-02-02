class Team {
  final String id;
  final String name;
  final String logo;

  Team({required this.id, required this.name, required this.logo});

  factory Team.fromJson(Map<String, dynamic> json) {
    return Team(id: json['id'], name: json['name'], logo: json['logo']);
  }

  Map<String, dynamic> toJson() {
    return {'id': id, 'name': name, 'logo': logo};
  }
}
