import { sequelize } from '../database';
import { DataTypes, ModelDefined, Optional } from 'sequelize';

interface UserTeam {
  id: string;
  userId: string;
  matchId: string;
  pointsObtained?: number;
  leaderBoardRank?: number;
  isScoredComputed?: boolean;
}

interface UserTeamPlayer {
  id: string;
  userTeamId: string;
  playerId: string;
  isCaptain: boolean;
  isViceCaptain: boolean;
  isPlayed?: boolean;
  runs?: number;
  wickets?: number;
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
      defaultValue: DataTypes.UUIDV4, 
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    matchId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    pointsObtained:{
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    leaderBoardRank:{
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    isScoredComputed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }
);

const UserTeamPlayerModel: ModelDefined<UserTeamPlayer, UserTeamPlayerCreationAttributes> = sequelize.define(
  'user_team_players',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, 
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
    runs:{
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    wickets: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    isPlayed:{
      type: DataTypes.BOOLEAN,
      defaultValue: false
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

export { UserTeamModel, UserTeamPlayerModel };
