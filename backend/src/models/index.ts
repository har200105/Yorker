import { PlayerModel } from './player';
import { TeamModel } from './team';
import { TournamentModel } from './tournament';
import { MatchModel } from './match';
import { UserTeamModel, UserTeamPlayerModel } from './userTeam';
import { UserModel } from './user';

export const associate = () => {

    TeamModel.hasMany(PlayerModel, { foreignKey: 'teamId', as: 'teamPlayers' });
    PlayerModel.belongsTo(TeamModel, { foreignKey: 'teamId' });

    TournamentModel.hasMany(MatchModel, { foreignKey: 'tournamentId' });
    MatchModel.belongsTo(TournamentModel, { foreignKey: 'tournamentId' });

    MatchModel.belongsTo(TeamModel, { foreignKey: 'teamAId', as: 'teamA' });
    MatchModel.belongsTo(TeamModel, { foreignKey: 'teamBId', as: 'teamB' });
    MatchModel.belongsTo(TeamModel, { foreignKey: 'matchWonById', as: 'matchWonBy' });
    MatchModel.belongsTo(TeamModel, { foreignKey: 'tossWonById', as: 'tossWonBy' });

    UserTeamModel.belongsTo(UserModel, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    UserTeamModel.belongsTo(MatchModel, { foreignKey: 'matchId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    UserTeamModel.hasMany(UserTeamPlayerModel, { as: 'userTeamPlayers', foreignKey: 'userTeamId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

    UserTeamPlayerModel.belongsTo(UserTeamModel, { foreignKey: 'userTeamId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    UserTeamPlayerModel.belongsTo(PlayerModel, { foreignKey: 'playerId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

};
