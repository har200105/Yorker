import client, { Channel, Connection } from 'amqplib';

import { Logger } from 'winston';
import { config } from '../config';
import { winstonLogger } from '../shared/logger';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`,'queueConnection', 'debug');

async function createConnection(): Promise<Channel | undefined> {
  try {
    const connection: Connection = await client.connect(`${config.RABBITMQ_ENDPOINT}`);
    const channel: Channel = await connection.createChannel();
    log.info('Connected to queue successfully');
    closeConnection(channel, connection);
    return channel;
  } catch (error) {
    log.log('error', 'createConnection() method error:', error);
    return undefined;
  }
}

function closeConnection(channel: Channel, connection: Connection): void {
  process.once('SIGINT', async () => {
    await channel.close();
    await connection.close();
  });
}

export { createConnection } ;