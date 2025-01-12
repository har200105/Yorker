import { sequelize } from '../database';
import { DataTypes, ModelDefined, Optional } from 'sequelize';

interface Team {
  id: string;
  name: string;
  players: string[];
  logo?: string;
}

type TeamCreationAttributes = Optional<Team, 'id'>;

const TeamModel: ModelDefined<Team, TeamCreationAttributes> = sequelize.define('teams', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  players: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    allowNull: false,
  },
  logo:{
    type: DataTypes.STRING,
    allowNull: true
  }
});



export { TeamModel };
