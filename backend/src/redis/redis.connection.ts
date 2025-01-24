import { createClient } from 'redis';
import { config } from '../config';
import { winstonLogger } from '../shared/logger';
import { Logger } from 'winston';

type RedisClient = ReturnType<typeof createClient>;
const log: Logger = winstonLogger('redisConnection', 'debug');
const client: RedisClient = createClient({ url: `${config.REDIS_HOST}`});

const redisConnect = async (): Promise<void> => {
  try {
    await client.connect();
    log.info(`Redis Connection: ${await client.ping()}`);
    cacheError();
  } catch (error) {
    log.log('error', 'redisConnect() method error:', error);
  }
};

const cacheError = (): void => {
  client.on('error', (error: unknown) => {
    log.error(error);
  });
};

export { redisConnect, client };
