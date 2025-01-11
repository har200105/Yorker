import { sequelize } from '../database';
import { DataTypes, ModelDefined, Optional } from 'sequelize';


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
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
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


export { MatchModel };
