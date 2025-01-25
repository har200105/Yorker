import { Logger } from 'winston';
import { Sequelize } from 'sequelize';
import { winstonLogger } from './shared/logger';

const log: Logger = winstonLogger('database', 'debug');


export const sequelize = new Sequelize({
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    multipleStatements: true,
  },
  host: "localhost",
  port: parseInt(process.env.PG_PORT || '5432', 10),
  username: "postgres",
  password: '',
  database:"yorker_2",
});

export async function databaseConnection(): Promise<void> {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter:true });
    log.info('Successfully connected to the PostgreSQL server.');

    const result = await sequelize.query(`SELECT 1 FROM pg_database WHERE datname = 'yorker_2';`);

    if (result[0].length === 0) {
      await sequelize.query('CREATE DATABASE yorker_2;', { raw: true });
      log.info('Database "yorker_2" created successfully.');
    } else {
      log.info('Database "yorker_2" already exists.');
    }

    await sequelize.sync({});


    log.info('PostgreSQL database "v" connection has been established successfully.');


  } catch (error) {
    log.error('Server Unable to connect to the database.');
    log.log('error', 'databaseConnection() method error:', error);
  }
}
