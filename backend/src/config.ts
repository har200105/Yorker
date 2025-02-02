import dotenv from 'dotenv';

dotenv.config({});


class Config {
  public NODE_ENV: string | undefined;
  public RABBITMQ_ENDPOINT: string | undefined;
  public PSQL_DB: string | undefined;
  public JWT_TOKEN: string | undefined;
  public GATEWAY_JWT_TOKEN: string | undefined;
  public REDIS_HOST: string | undefined;
  public ACCESS_TOKEN_SECRET_KEY: string | undefined;
  public REFRESH_TOKEN_SECRET_KEY: string | undefined;

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.JWT_TOKEN = process.env.JWT_TOKEN || '';
    this.GATEWAY_JWT_TOKEN = process.env.GATEWAY_JWT_TOKEN || '';
    this.RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT || '';
    this.PSQL_DB = process.env.PSQL_DB || '';
    this.REDIS_HOST = process.env.REDIS_HOST || '';
    this.ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY || '';
    this.REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY || '';

  }
}

export const config: Config = new Config();