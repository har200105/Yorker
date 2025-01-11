import { sequelize } from "../database";
import { MatchModel } from "../models/match";
import { PlayerModel } from "../models/player";
import { TeamModel } from "../models/team";
import { TournamentModel } from "../models/tournament";


const populateDummyData = async () => {

    MatchModel.destroy({});
    TournamentModel.destroy({});
    PlayerModel.destroy({});
    MatchModel.destroy({});

  try {
    // Sync the models with the database
    await sequelize.sync({ force: true }); // WARNING: This will drop all tables and recreate them

    console.log('Database synced successfully.');

    // Create a tournament
    const tournament = await TournamentModel.create({
      name: 'Champions Trophy',
      startDate: new Date('2025-02-19'),
      endDate: new Date('2025-03-09'),
      status: 'upcoming',
      tournamentLogo: 'https://upload.wikimedia.org/wikipedia/en/1/18/2025_IPL_logo.png?20241001000050',
      isActive: true
    });

    console.log('Tournament created:', tournament.dataValues.id);

    // Create teams
    const teamA = await TeamModel.create({
      name: 'India',
      players: [], // Will be populated later
    });

    const teamB = await TeamModel.create({
      name: 'Pakistan',
      players: [],
    });

    console.log('Teams created:', teamA.dataValues.id, teamB.dataValues.id);

    // Create players
    const playersTeamA = await Promise.all([
      PlayerModel.create({ name: 'Virat Kohli', teamId: teamA.dataValues.id, role: 'batsman' }),
      PlayerModel.create({ name: 'Rohit Sharma', teamId: teamA.dataValues.id, role: 'batsman'}),
      PlayerModel.create({ name: 'Rishabh Pant', teamId: teamA.dataValues.id, role: 'wicketkeeper'}),
      PlayerModel.create({ name: 'Yashashvi Jaiswal', teamId: teamA.dataValues.id, role: 'batsman'}),
      PlayerModel.create({ name: 'Hardik Pandya', teamId: teamA.dataValues.id, role: 'allrounder'}),
      PlayerModel.create({ name: 'Jasprit Bumrah', teamId: teamA.dataValues.id, role: 'bowler'}),
      PlayerModel.create({ name: 'Mohammad Siraj', teamId: teamA.dataValues.id, role: 'bowler'}),
      PlayerModel.create({ name: 'Ravindra Jadeja', teamId: teamA.dataValues.id, role: 'allrounder'}),
      PlayerModel.create({ name: 'Nitish Kumar Reddy', teamId: teamA.dataValues.id, role: 'allrounder'}),
      PlayerModel.create({ name: 'Kuldeep Yadav', teamId: teamA.dataValues.id, role: 'bowler'}),
      PlayerModel.create({ name: 'Shreyas Iyer', teamId: teamA.dataValues.id, role: 'batsman'}),
    ]);

    const playersTeamB = await Promise.all([
        PlayerModel.create({ name: 'Babar Azam', teamId: teamB.dataValues.id, role: 'batsman' }),
        PlayerModel.create({ name: 'Saim Ayub', teamId: teamB.dataValues.id, role: 'batsman'}),
        PlayerModel.create({ name: 'Abdullah Shafique', teamId: teamB.dataValues.id, role: 'batsman'}),
        PlayerModel.create({ name: 'Usman Khan', teamId: teamB.dataValues.id, role: 'batsman'}),
        PlayerModel.create({ name: 'Salman Agha', teamId: teamB.dataValues.id, role: 'allrounder'}),
        PlayerModel.create({ name: 'Naseem Shah', teamId: teamB.dataValues.id, role: 'bowler'}),
        PlayerModel.create({ name: 'Mohammad Rizwan', teamId: teamB.dataValues.id, role: 'wicketkeeper'}),
        PlayerModel.create({ name: 'Kamran Ghulam', teamId: teamB.dataValues.id, role: 'allrounder'}),
        PlayerModel.create({ name: 'Abrar Ahmed', teamId: teamB.dataValues.id, role: 'bowler'}),
        PlayerModel.create({ name: 'Shaheen Shah Afridi', teamId: teamB.dataValues.id, role: 'bowler'}),
        PlayerModel.create({ name: 'Haris Rauf', teamId: teamB.dataValues.id, role: 'bowler'}),
    ]);

    console.log('Players created for Team A and Team B.');

    // Update team players
    teamA.dataValues.players = playersTeamA.map((player) => player.dataValues.id);
    await teamA.save();

    teamB.dataValues.players = playersTeamB.map((player) => player.dataValues.id);
    await teamB.save();

    console.log('Teams updated with player IDs.');

    // Create a match
    const match = await MatchModel.create({
      name: 'India vs Pakistan',
      teamAId: teamA.dataValues.id,
      teamBId: teamB.dataValues.id,
      date: new Date('2025-02-23'),
      status: 'scheduled',
      venue: 'Dubai',
      tournamentId: tournament.dataValues.id,
    });

    console.log('Match created:', match.dataValues.id);

    console.log('Dummy data populated successfully.');
  } catch (error) {
    console.error('Error populating dummy data:', error);
  } finally {
    await sequelize.close();
  }
};

populateDummyData();
