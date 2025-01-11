import dotenv from 'dotenv';

dotenv.config({});


class Config {
  public NODE_ENV: string | undefined;
  public RABBITMQ_ENDPOINT: string | undefined;
  public PSQL_DB: string | undefined;
  public JWT_TOKEN: string | undefined;
  public GATEWAY_JWT_TOKEN: string | undefined;
  public API_GATEWAY_URL: string | undefined;
  public ELASTIC_SEARCH_URL: string | undefined;
  public REDIS_HOST: string | undefined;

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.JWT_TOKEN = process.env.JWT_TOKEN || '';
    this.GATEWAY_JWT_TOKEN = process.env.GATEWAY_JWT_TOKEN || '';
    this.RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT || '';
    this.PSQL_DB = process.env.PSQL_DB || '';
    this.API_GATEWAY_URL = process.env.API_GATEWAY_URL || '';
    this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || '';
    this.REDIS_HOST = process.env.REDIS_HOST || '';
  }
}

export const config: Config = new Config();