import { sequelize } from '../database';
import { DataTypes, ModelDefined, Optional } from 'sequelize';
import { UserModel } from './user';
import { MatchModel } from './match';
import { PlayerModel } from './player';

interface UserTeam {
  id: string;                 
  userId: string;             
  matchId: string;            
}

interface UserTeamPlayer {
  id: string;                 
  userTeamId: string;         
  playerId: string;           
  isCaptain: boolean;         
  isViceCaptain: boolean;     
  points: number;             
}

type UserTeamCreationAttributes = Optional<UserTeam, 'id'>;
type UserTeamPlayerCreationAttributes = Optional<UserTeamPlayer, 'id'>;

const UserTeamModel: ModelDefined<UserTeam, UserTeamCreationAttributes> = sequelize.define('user_teams', {
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  matchId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

const UserTeamPlayerModel: ModelDefined<UserTeamPlayer, UserTeamPlayerCreationAttributes> = sequelize.define('user_team_players', {
  userTeamId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  playerId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  isCaptain: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    validate: {
      notBothCaptainAndViceCaptain() {
        if (this.isCaptain && this.isViceCaptain) {
          throw new Error('A player cannot be both Captain and Vice-Captain.');
        }
      },
    },
  },
  isViceCaptain: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  points: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
});

// Associations
UserTeamModel.belongsTo(UserModel, { foreignKey: 'userId' });           
UserTeamModel.belongsTo(MatchModel, { foreignKey: 'matchId' });        
UserTeamModel.hasMany(UserTeamPlayerModel, { foreignKey: 'userTeamId' });

UserTeamPlayerModel.belongsTo(UserTeamModel, { foreignKey: 'userTeamId' });
UserTeamPlayerModel.belongsTo(PlayerModel, { foreignKey: 'playerId' });

export { UserTeamModel, UserTeamPlayerModel };
