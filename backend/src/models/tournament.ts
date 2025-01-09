import { sequelize } from '../database';
import { DataTypes, ModelDefined, Optional } from 'sequelize';
import { MatchModel } from './match';

interface Tournament {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  status: 'upcoming' | 'ongoing' | 'completed';
}

type TournamentCreationAttributes = Optional<Tournament, 'id'>;

const TournamentModel: ModelDefined<Tournament, TournamentCreationAttributes> = sequelize.define('tournaments', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('upcoming', 'ongoing', 'completed'),
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

// Associations
TournamentModel.hasMany(MatchModel, { foreignKey: 'tournamentId' });

export { TournamentModel };
