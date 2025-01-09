import { sequelize } from '../database';
import { DataTypes, ModelDefined, Optional } from 'sequelize';
import { TournamentModel } from './tournament';
import { TeamModel } from './team';

interface Match {
  id: string;
  name: string;
  teamAId: string;
  teamBId: string;
  date: Date;
  status: 'scheduled' | 'live' | 'completed';
  venue: string;
  tournamentId: string;
}

type MatchCreationAttributes = Optional<Match, 'id'>;

const MatchModel: ModelDefined<Match, MatchCreationAttributes> = sequelize.define('matches', {
  name:{
    type: DataTypes.STRING,
    allowNull: false
  },
  teamAId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  teamBId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'live', 'completed'),
    allowNull: false,
  },
  venue: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tournamentId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

// Associations
MatchModel.belongsTo(TournamentModel, { foreignKey: 'tournamentId' });
MatchModel.belongsTo(TeamModel, { foreignKey: 'teamAId', as: 'teamA' });
MatchModel.belongsTo(TeamModel, { foreignKey: 'teamBId', as: 'teamB' });

export { MatchModel };
