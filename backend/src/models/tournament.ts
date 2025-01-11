import { sequelize } from '../database';
import { DataTypes, ModelDefined, Optional } from 'sequelize';

interface Tournament {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  tournamentLogo: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

type TournamentCreationAttributes = Optional<Tournament, 'id'>;

const TournamentModel: ModelDefined<Tournament, TournamentCreationAttributes> = sequelize.define('tournaments', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4, // Automatically generate a UUID
  },
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
  tournamentLogo:{
    type: DataTypes.STRING,
    allowNull: true
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


export { TournamentModel };
