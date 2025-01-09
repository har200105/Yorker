import { sequelize } from '../database';
import { DataTypes, ModelDefined, Optional } from 'sequelize';
import { TeamModel } from './team';

interface Player {
  id: string;
  name: string;
  teamId: string;
  role: 'batsman' | 'bowler' | 'allrounder' | 'wicketkeeper';
  points: number;
}

type PlayerCreationAttributes = Optional<Player, 'id'>;

const PlayerModel: ModelDefined<Player, PlayerCreationAttributes> = sequelize.define('players', {
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
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

// Associations
PlayerModel.belongsTo(TeamModel, { foreignKey: 'teamId' });

export { PlayerModel };
