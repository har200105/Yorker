import { sequelize } from '../database';
import { DataTypes, ModelDefined, Optional } from 'sequelize';

interface Player {
  id: string;
  name: string;
  teamId: string;
  role: 'batsman' | 'bowler' | 'allrounder' | 'wicketkeeper';
}

type PlayerCreationAttributes = Optional<Player, 'id'>;

const PlayerModel: ModelDefined<Player, PlayerCreationAttributes> = sequelize.define('players', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4, // Automatically generate a UUID
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  teamId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('batsman', 'bowler', 'allrounder', 'wicketkeeper'),
    allowNull: false,
  }
});

// Associations

export { PlayerModel };
