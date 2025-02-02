import { sequelize } from "../database";
import { MatchModel } from "../models/match";
import { PlayerModel } from "../models/player";
import { TeamModel } from "../models/team";
import { TournamentModel } from "../models/tournament";

   MatchModel.destroy({
    where:{}
   });
    TournamentModel.destroy({
      where:{}
    });
    PlayerModel.destroy({
      where:{}
    });
    MatchModel.destroy({
      where:{}
    });

const teamsData = [
  {
    name: 'India',
    logo: 'https://upload.wikimedia.org/wikipedia/mai/1/11/India_national_cricket_team.png?20180317123159',
    players: [
      { name: 'Virat Kohli', role: 'batsman', credits: 10, photo: 'https://static.cricbuzz.com/a/img/v1/152x152/i1/c591944/virat-kohli.jpg' },
      { name: 'Rohit Sharma', role: 'batsman', credits: 10, photo: 'https://static.cricbuzz.com/a/img/v1/152x152/i1/c592009/rohit-sharma.jpg' },
      { name: 'Yashashvi Jaiswal', role: 'batsman', credits: 9, photo: 'https://static.cricbuzz.com/a/img/v1/152x152/i1/c591942/yashasvi-jaiswal.jpg' },
      { name: 'Shubhman Gill', role: 'batsman', credits: 9, photo: 'https://static.cricbuzz.com/a/img/v1/i1/c591953/shubman-gill.jpg?d=low&p=gthumb' },
      { name: 'Shreyas Iyer', role: 'batsman', credits: 9, photo: 'https://static.cricbuzz.com/a/img/v1/152x152/i1/c352480/shreyas-iyer.jpg' },

      { name: 'Rishabh Pant', role: 'wicketkeeper', credits: 9, photo: 'https://static.cricbuzz.com/a/img/v1/152x152/i1/c591945/rishabh-pant.jpg' },
      { name: 'KL Rahul', role: 'wicketkeeper', credits: 9, photo: 'https://static.cricbuzz.com/a/img/v1/i1/c591943/kl-rahul.jpg?d=low&p=gthumb' },



      { name: 'Hardik Pandya', role: 'allrounder', credits: 9, photo: 'https://static.cricbuzz.com/a/img/v1/152x152/i1/c352482/hardik-pandya.jpg' },
      { name: 'Axar Patel', role: 'allrounder', credits: 8, photo: 'https://static.cricbuzz.com/a/img/v1/i1/c332897/axar-patel.jpg?d=low&p=gthumb' },
      { name: 'Ravindra Jadeja', role: 'allrounder', credits: 8, photo: 'https://static.cricbuzz.com/a/img/v1/152x152/i1/c591946/ravindra-jadeja.jpg' },
      { name: 'Washington Sundar', role: 'allrounder', credits: 8, photo: 'https://static.cricbuzz.com/a/img/v1/i1/c591948/washington-sundar.jpg?d=low&p=gthumb' },


      { name: 'Jasprit Bumrah', role: 'bowler', credits: 10, photo: 'https://static.cricbuzz.com/a/img/v1/152x152/i1/c591949/jasprit-bumrah.jpg' },
      { name: 'Mohammad Shami', role: 'bowler', credits: 10, photo: 'https://static.cricbuzz.com/a/img/v1/i1/c352489/mohammed-shami.jpg?d=low&p=gthumb' },
      {name:'Arshdeep Singh',role:'bowler',credits:9,photo:'https://static.cricbuzz.com/a/img/v1/i1/c244971/arshdeep-singh.jpg?d=low&p=gthumb'},
      { name: 'Kuldeep Yadav', role: 'bowler', credits: 8, photo: 'https://static.cricbuzz.com/a/img/v1/152x152/i1/c352490/kuldeep-yadav.jpg' },
    ]
  },
  {
    name: 'Pakistan',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Pakistan_cricket_team_logo.png',
    players: [
      { name: 'Babar Azam', role: 'batsman', credits: 10, photo: 'https://static.cricbuzz.com/a/img/v1/152x152/i1/c352417/babar-azam.jpg' },
      { name: 'Fakhar Zaman', role: 'batsman', credits: 10, photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_h_100/lsci/db/PICTURES/CMS/382000/382031.6.png' },
      { name: 'Saud Shakeel', role: 'batsman', credits: 8, photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_h_100/lsci/db/PICTURES/CMS/313600/313620.5.png' },
      { name: 'Mohammad Rizwan', role: 'wicketkeeper', credits: 10, photo: 'https://static.cricbuzz.com/a/img/v1/152x152/i1/c352426/mohammad-rizwan.jpg' },
      { name: 'Usman Khan', role: 'batsman', credits: 7, photo: 'https://static.cricbuzz.com/a/img/v1/152x152/i1/c582335/usman-khan.jpg' },
      { name: 'Tayyab Tahir', role: 'batsman', credits: 8, photo: 'https://static.cricbuzz.com/a/img/v1/152x152/i1/c182026/tayyab-tahir.jpg' },
      
      { name: 'Faheem Ashraf', role: 'allrounder', credits: 8, photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_h_100/lsci/db/PICTURES/CMS/322100/322198.1.png' },
      { name: 'Khushdil Shah', role: 'allrounder', credits: 8, photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_h_100/lsci/db/PICTURES/CMS/322100/322168.1.png' },
      { name: 'Salman Agha', role: 'allrounder', credits: 7, photo: 'https://static.cricbuzz.com/a/img/v1/152x152/i1/c352422/salman-agha.jpg' },
      { name: 'Kamran Ghulam', role: 'allrounder', credits: 8, photo: 'https://static.cricbuzz.com/a/img/v1/152x152/i1/c582347/kamran-ghulam.jpg' },
      
      { name: 'Naseem Shah', role: 'bowler', credits: 10, photo: 'https://static.cricbuzz.com/a/img/v1/152x152/i1/c244958/naseem-shah.jpg' },
      { name: 'Abrar Ahmed', role: 'bowler', credits: 8, photo: 'https://static.cricbuzz.com/a/img/v1/152x152/i1/c582348/abrar-ahmed.jpg' },
      { name: 'Shaheen Shah Afridi', role: 'bowler', credits: 10, photo: 'https://static.cricbuzz.com/a/img/v1/152x152/i1/c352430/shaheen-afridi.jpg' },
      { name: 'Haris Rauf', role: 'bowler', credits: 8, photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/1_53_Haris_Rauf.jpg/440px-1_53_Haris_Rauf.jpg' },
      { name: 'Mohammad Hasnain', role: 'bowler', credits: 8, photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_h_100/lsci/db/PICTURES/CMS/322200/322216.1.png' },

    ]
  },
  {
    name: 'Bangladesh',
    logo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci/db/PICTURES/CMS/341400/341456.png',
    players: [
      { name: 'Najmul Hossain Shanto', role: 'batsman', credits: 9, photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_h_100/lsci/db/PICTURES/CMS/323100/323155.1.png' },
      { name: 'Jaker Ali', role: 'batsman', credits: 7, photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_h_100/lsci/db/PICTURES/CMS/389500/389548.5.png' },
      { name: 'Mushfiqur Rahim', role: 'wicketkeeper', credits: 10, photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_h_100/lsci/db/PICTURES/CMS/385700/385790.1.png' },
      { name: 'Parvez Hossain Emon', role: 'batsman', credits: 6, photo: 'https://static.cricbuzz.com/a/img/v1/152x152/i1/c182026/parvez-hossain-emon.jpg' },
      { name: 'Tanzid Hasan', role: 'batsman', credits: 7, photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_h_100/lsci/db/PICTURES/CMS/392000/392065.2.png' },
      { name: 'Towhid Hridoy', role: 'batsman', credits: 8, photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_h_100/lsci/db/PICTURES/CMS/392000/392065.2.png' },


      { name: 'Mahmudullah', role: 'allrounder', credits: 10, photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_h_100/lsci/db/PICTURES/CMS/382800/382810.1.png' },
      { name: 'Mehidy Hasan Miraz', role: 'allrounder', credits: 10, photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_h_100/lsci/db/PICTURES/CMS/319700/319728.3.png' },
      { name: 'Nasum Ahmed', role: 'allrounder', credits: 8, photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_h_100/lsci/db/PICTURES/CMS/323100/323176.1.png' },
      { name: 'Rishad Hossain', role: 'allrounder', credits: 8, photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_h_100/lsci/db/PICTURES/CMS/382800/382809.1.png' },
      { name: 'Soumya Sarkar', role: 'allrounder', credits: 9, photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_h_100/lsci/db/PICTURES/CMS/385800/385821.1.png' },
      { name: 'Tanzim Hasan Sakib', role: 'allrounder', credits: 7, photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_h_100/lsci/db/PICTURES/CMS/382800/382811.1.png' },

      { name: 'Mustafizur Rahman', role: 'bowler', credits: 10, photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_h_100/lsci/db/PICTURES/CMS/319700/319734.3.png' },
      { name: 'Nahid Rana', role: 'bowler', credits: 8, photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_h_100/lsci/db/PICTURES/CMS/392100/392139.2.png' },
      { name: 'Taskin Ahmed', role: 'bowler', credits: 10, photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_h_100/lsci/db/PICTURES/CMS/316700/316703.1.png' },
    ]
  },
  {
    name: 'New Zealand',
    logo: 'https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci/db/PICTURES/CMS/340500/340505.png',
    players: [
      { name: 'Devon Conway', role: 'batsman', credits: 10, photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_h_100/lsci/db/PICTURES/CMS/383100/383148.1.png' },
      { name: 'Tom Latham', role: 'wicketkeeper', credits: 9, photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_h_100/lsci/db/PICTURES/CMS/316600/316672.1.png' },
      { name: 'Kane Williamson', role: 'batsman', credits: 10, photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_h_100/lsci/db/PICTURES/CMS/383100/383172.1.png' },
      { name: 'Will Young', role: 'batsman', credits: 8, photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_h_100/lsci/db/PICTURES/CMS/346200/346246.1.png' },
      
      { name: 'Mitchell Santher', role: 'allrounder', credits: 10, photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_h_100/lsci/db/PICTURES/CMS/383100/383180.1.png' },
      { name: 'Michael Bracewell', role: 'allrounder', credits: 8, photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_h_100/lsci/db/PICTURES/CMS/383100/383179.1.png' },
      { name: 'Mark Chapman', role: 'allrounder', credits: 8, photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_h_100/lsci/db/PICTURES/CMS/383100/383176.1.png' },
      { name: 'Daryll Mitchell', role: 'allrounder', credits: 10, photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_h_100/lsci/db/PICTURES/CMS/383100/383147.2.png' },
      { name: 'Rachin Ravindra', role: 'allrounder', credits: 10, photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_h_100/lsci/db/PICTURES/CMS/383100/383182.1.png' },
      { name: 'Glenn Phillips', role: 'allrounder', credits: 10, photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_h_100/lsci/db/PICTURES/CMS/383100/383167.1.png' },
      { name: 'Nathan Smith', role: 'allrounder', credits: 7, photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_h_100/lsci/db/PICTURES/CMS/390600/390607.5.png' },
      
      { name: 'Lockie Ferguson', role: 'bowler', credits: 9, photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_h_100/lsci/db/PICTURES/CMS/383100/383174.1.png' },
      { name: 'Matt Henry', role: 'bowler', credits: 9, photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_h_100/lsci/db/PICTURES/CMS/383100/383178.1.png' },
      { name: 'Will ORourke', role: 'bowler', credits: 9, photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_h_100/lsci/db/PICTURES/CMS/387600/387602.4.png' },
      { name: 'Ben Sears', role: 'bowler', credits: 7, photo: 'https://img1.hscicdn.com/image/upload/f_auto,t_h_100/lsci/db/PICTURES/CMS/393500/393571.2.png' },


    ]
  }
];

const populateDummyData = async () => {
  try {
    const tournament = await TournamentModel.create({
      name: 'Champions Trophy',
      startDate: new Date('2025-02-19'),
      endDate: new Date('2025-03-09'),
      status: 'upcoming',
      tournamentLogo: 'https://upload.wikimedia.org/wikipedia/en/1/18/2025_IPL_logo.png?20241001000050',
      isActive: true
    });

    // Create teams and players
    const createdTeams = [];
    for (const teamData of teamsData) {
      const team = await TeamModel.create({
        name: teamData.name,
        logo: teamData.logo,
        players: []
      });

      const createdPlayers = await Promise.all(
        teamData.players.map((player) =>
          PlayerModel.create({
            name: player.name,
            teamId: team.dataValues.id,
            role: player.role as any,
            credits: player.credits,
            photo: player.photo
          })
        )
      );

      team.dataValues.players = createdPlayers.map((player) => player.dataValues.id);
      await team.save();
      createdTeams.push(team);
    }

    console.log('Teams and players created.');

    // Create matches
    const matchesData = [
      { teamA: 'India', teamB: 'Bangladesh', date: '2025-02-20' },
      { teamA: 'India', teamB: 'Pakistan', date: '2025-02-23' },
      { teamA: 'India', teamB: 'New Zealand', date: '2025-03-02' }
    ];

    for (const matchData of matchesData) {
      const teamA = createdTeams.find((team) => team.dataValues.name === matchData.teamA);
      const teamB = createdTeams.find((team) => team.dataValues.name === matchData.teamB);

      await MatchModel.create({
        name: `${teamA?.dataValues.name} vs ${teamB?.dataValues.name}`,
        teamAId: teamA?.dataValues.id || '',
        teamBId: teamB?.dataValues.id || '',
        date: new Date(matchData.date),
        status: 'scheduled',
        venue: 'Dubai',
        tournamentId: tournament.dataValues.id
      });
    }

    console.log('Matches created.');

    console.log('Dummy data populated successfully.');
  } catch (error) {
    console.error('Error populating dummy data:', error);
  } finally {
    await sequelize.close();
  }
};

populateDummyData();
