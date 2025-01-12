import { Logger } from 'winston';
import { Sequelize } from 'sequelize';
import { config } from './config';
import { winstonLogger } from './shared/logger';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'database', 'debug');

export const sequelize = new Sequelize({
  dialect: 'postgres',
  logging: true,
  dialectOptions: {
    multipleStatements: true,
  },
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT || '5432', 10),
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database:process.env.PG_DB,
});

export async function databaseConnection(): Promise<void> {
  try {
    await sequelize.authenticate();
    await sequelize.sync({alter:true});
    log.info('Successfully connected to the PostgreSQL server.');

    const result = await sequelize.query(`SELECT 1 FROM pg_database WHERE datname = 'yorker';`);

    if (result[0].length === 0) {
      await sequelize.query('CREATE DATABASE yorker;', { raw: true });
      log.info('Database "yorker" created successfully.');
    } else {
      log.info('Database "yorker" already exists.');
    }

    await sequelize.sync({});


    log.info('PostgreSQL database "yorker" connection has been established successfully.');


    console.log("changes");

  } catch (error) {
    log.error('Server Unable to connect to the database.');
    log.log('error', 'databaseConnection() method error:', error);
  }
}
