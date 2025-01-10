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

const UserTeamModel: ModelDefined<UserTeam, UserTeamCreationAttributes> = sequelize.define(
  'user_teams',
  {
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    matchId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['userId', 'matchId'], // Ensure one team per user per match
      },
    ],
  }
);

const UserTeamPlayerModel: ModelDefined<UserTeamPlayer, UserTeamPlayerCreationAttributes> = sequelize.define(
  'user_team_players',
  {
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
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['userTeamId', 'playerId'],
      },
    ],
  }
);

// Associations
UserTeamModel.belongsTo(UserModel, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
UserTeamModel.belongsTo(MatchModel, { foreignKey: 'matchId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
UserTeamModel.hasMany(UserTeamPlayerModel, { foreignKey: 'userTeamId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

UserTeamPlayerModel.belongsTo(UserTeamModel, { foreignKey: 'userTeamId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
UserTeamPlayerModel.belongsTo(PlayerModel, { foreignKey: 'playerId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

export { UserTeamModel, UserTeamPlayerModel };
