import { Logger } from 'winston';
import { Sequelize } from 'sequelize';
import { config } from './config';
import { winstonLogger } from './shared/logger';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'authDatabaseServer', 'debug');

export const sequelize: Sequelize = new Sequelize(process.env.PG_DB!, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    multipleStatements: true,
  },
  host: process.env.PG_HOST, 
  port: parseInt(process.env.PG_PORT || '5432', 10),
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD, 
});

export async function databaseConnection(): Promise<void> {
  try {
    await sequelize.authenticate();
    log.info('AuthService PostgreSQL database connection has been established successfully.');
  } catch (error) {
    log.error('Auth Service - Unable to connect to database.');
    log.log('error', 'AuthService databaseConnection() method error:', error);
  }
}
