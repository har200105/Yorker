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
  matchWonById?: string;
  tossWonById?: string;
  isTie?: boolean;
  isCalledOff?:boolean;
  wonByEntity?: string;
  wonByQuantity?: number;
  scoreboard?:object;

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
  matchWonById:{
    type: DataTypes.UUID,
    allowNull: true,
  },
  tossWonById:{
    type:DataTypes.UUID,
    allowNull: true
  },
  isTie:{
    type:DataTypes.BOOLEAN,
    allowNull:false,
    defaultValue: false
  },
  isCalledOff:{
    type:DataTypes.BOOLEAN,
    allowNull:false,
    defaultValue: false
  },
  wonByEntity:{
    type:DataTypes.ENUM('RUNS','WICKETS'),
    allowNull: true
  },
  wonByQuantity:{
    type:DataTypes.INTEGER,
    allowNull: true
  },
  tournamentId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  scoreboard: {
    type: DataTypes.JSONB, 
    allowNull: true,  
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
});


export { MatchModel };
