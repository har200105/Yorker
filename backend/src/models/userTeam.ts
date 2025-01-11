import { sequelize } from '../database';
import { DataTypes, ModelDefined, Optional } from 'sequelize';

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
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, // Automatically generate a UUID
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    matchId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  }
);

const UserTeamPlayerModel: ModelDefined<UserTeamPlayer, UserTeamPlayerCreationAttributes> = sequelize.define(
  'user_team_players',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, // Automatically generate a UUID
    },
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

export { UserTeamModel, UserTeamPlayerModel };
