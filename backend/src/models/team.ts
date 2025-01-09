import { sequelize } from '../database';
import { DataTypes, ModelDefined, Optional } from 'sequelize';
import { PlayerModel } from './player';

interface Team {
  id: string;
  name: string;
  players: string[];
  captain: string; 
}

type TeamCreationAttributes = Optional<Team, 'id'>;

const TeamModel: ModelDefined<Team, TeamCreationAttributes> = sequelize.define('teams', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  players: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    allowNull: false,
  },
  captain: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

// Associations
TeamModel.hasMany(PlayerModel, { foreignKey: 'teamId' });

export { TeamModel };
