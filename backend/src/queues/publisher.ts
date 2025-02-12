
import { Channel } from 'amqplib';
import { Logger } from 'winston';
import { winstonLogger } from '../shared/logger';
import { createConnection } from './connection';

const log: Logger = winstonLogger('queuePublisher', 'debug');

const publishDirectMessage = async (
  channel: Channel,
  exchangeName: string,
  routingKey: string,
  message: string,
  logMessage: string
): Promise<void> => {
  try {
    if (!channel) {
      channel = await createConnection() as Channel;
    }
    await channel.assertExchange(exchangeName, 'direct');
    channel.publish(exchangeName, routingKey, Buffer.from(message));
    log.info(logMessage);
  } catch (error) {
    log.log('error', 'publishDirectMessage() method error:', error);
  }
};

export { publishDirectMessage };
