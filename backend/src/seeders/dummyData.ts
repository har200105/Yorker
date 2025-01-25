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


    // Create a tournament
    const tournament = await TournamentModel.create({
      name: 'Champions Trophy',
      startDate: new Date('2025-02-19'),
      endDate: new Date('2025-03-09'),
      status: 'upcoming',
      tournamentLogo: 'https://upload.wikimedia.org/wikipedia/en/1/18/2025_IPL_logo.png?20241001000050',
      isActive: true
    });

    // Create teams
    const teamA = await TeamModel.create({
      name: 'India',
      players: [], 
      logo:'https://upload.wikimedia.org/wikipedia/mai/1/11/India_national_cricket_team.png?20180317123159'
    });

    const teamB = await TeamModel.create({
      name: 'Pakistan',
      players: [],
      logo:'https://upload.wikimedia.org/wikipedia/commons/a/ad/Pakistan_cricket_team_logo.png'
    });

    console.log('Teams created:', teamA.dataValues.id, teamB.dataValues.id);

    // Create players
    const playersTeamA = await Promise.all([
      PlayerModel.create({ name: 'Virat Kohli', teamId: teamA.dataValues.id, role: 'batsman',credits:10,photo:'https://static.cricbuzz.com/a/img/v1/152x152/i1/c591944/virat-kohli.jpg' }),
      PlayerModel.create({ name: 'Rohit Sharma', teamId: teamA.dataValues.id, role: 'batsman',credits: 10,photo:'https://static.cricbuzz.com/a/img/v1/152x152/i1/c592009/rohit-sharma.jpg'}),
      PlayerModel.create({ name: 'Rishabh Pant', teamId: teamA.dataValues.id, role: 'wicketkeeper',credits:9,photo:'https://static.cricbuzz.com/a/img/v1/152x152/i1/c591945/rishabh-pant.jpg'}),
      PlayerModel.create({ name: 'Yashashvi Jaiswal', teamId: teamA.dataValues.id, role: 'batsman',credits:9,photo:'https://static.cricbuzz.com/a/img/v1/152x152/i1/c591942/yashasvi-jaiswal.jpg'}),
      PlayerModel.create({ name: 'Hardik Pandya', teamId: teamA.dataValues.id, role: 'allrounder',credits:9,photo:'https://static.cricbuzz.com/a/img/v1/152x152/i1/c352482/hardik-pandya.jpg'}),
      PlayerModel.create({ name: 'Jasprit Bumrah', teamId: teamA.dataValues.id, role: 'bowler',credits:10,photo:'https://static.cricbuzz.com/a/img/v1/152x152/i1/c591949/jasprit-bumrah.jpg'}),
      PlayerModel.create({ name: 'Mohammad Siraj', teamId: teamA.dataValues.id, role: 'bowler',credits: 8,photo:'https://static.cricbuzz.com/a/img/v1/152x152/i1/c591952/mohammed-siraj.jpg'}),
      PlayerModel.create({ name: 'Ravindra Jadeja', teamId: teamA.dataValues.id, role: 'allrounder',credits:8,photo:'https://static.cricbuzz.com/a/img/v1/152x152/i1/c591946/ravindra-jadeja.jpg'}),
      PlayerModel.create({ name: 'Nitish Kumar Reddy', teamId: teamA.dataValues.id, role: 'allrounder',credits: 7,photo:'https://static.cricbuzz.com/a/img/v1/152x152/i1/c591947/nitish-kumar-reddy.jpg'}),
      PlayerModel.create({ name: 'Kuldeep Yadav', teamId: teamA.dataValues.id, role: 'bowler',credits:7,photo:'https://static.cricbuzz.com/a/img/v1/152x152/i1/c352490/kuldeep-yadav.jpg'}),
      PlayerModel.create({ name: 'Shreyas Iyer', teamId: teamA.dataValues.id, role: 'batsman',credits:8,photo:'https://static.cricbuzz.com/a/img/v1/152x152/i1/c352480/shreyas-iyer.jpg'}),
    ]);

    const playersTeamB = await Promise.all([
        PlayerModel.create({ name: 'Babar Azam', teamId: teamB.dataValues.id, role: 'batsman',credits:10,photo:'https://static.cricbuzz.com/a/img/v1/152x152/i1/c352417/babar-azam.jpg' }),
        PlayerModel.create({ name: 'Saim Ayub', teamId: teamB.dataValues.id, role: 'batsman',credits:10,photo:'https://static.cricbuzz.com/a/img/v1/152x152/i1/c582345/saim-ayub.jpg'}),
        PlayerModel.create({ name: 'Abdullah Shafique', teamId: teamB.dataValues.id, role: 'batsman',credits:8,photo:'https://api.bdcrictime.com/Profile/abdullah-shafique-11_10_2023.jpg'}),
        PlayerModel.create({ name: 'Usman Khan', teamId: teamB.dataValues.id, role: 'batsman',credits:7,photo:'https://static.cricbuzz.com/a/img/v1/152x152/i1/c582335/usman-khan.jpg'}),
        PlayerModel.create({ name: 'Salman Agha', teamId: teamB.dataValues.id, role: 'allrounder',credits:7,photo:'https://static.cricbuzz.com/a/img/v1/152x152/i1/c352422/salman-agha.jpg'}),
        PlayerModel.create({ name: 'Naseem Shah', teamId: teamB.dataValues.id, role: 'bowler',credits:10,photo:'https://static.cricbuzz.com/a/img/v1/152x152/i1/c244958/naseem-shah.jpg'}),
        PlayerModel.create({ name: 'Mohammad Rizwan', teamId: teamB.dataValues.id, role: 'wicketkeeper',credits:10,photo:'https://static.cricbuzz.com/a/img/v1/152x152/i1/c352426/mohammad-rizwan.jpg'}),
        PlayerModel.create({ name: 'Kamran Ghulam', teamId: teamB.dataValues.id, role: 'allrounder',credits:8,photo:'https://static.cricbuzz.com/a/img/v1/152x152/i1/c582347/kamran-ghulam.jpg'}),
        PlayerModel.create({ name: 'Abrar Ahmed', teamId: teamB.dataValues.id, role: 'bowler',credits:8,photo:'https://static.cricbuzz.com/a/img/v1/152x152/i1/c582348/abrar-ahmed.jpg'}),
        PlayerModel.create({ name: 'Shaheen Shah Afridi', teamId: teamB.dataValues.id, role: 'bowler',credits:10,photo:'https://static.cricbuzz.com/a/img/v1/152x152/i1/c352430/shaheen-afridi.jpg'}),
        PlayerModel.create({ name: 'Haris Rauf', teamId: teamB.dataValues.id, role: 'bowler',credits:8,photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/1_53_Haris_Rauf.jpg/440px-1_53_Haris_Rauf.jpg'}),
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
