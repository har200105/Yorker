import { Channel, ConsumeMessage } from "amqplib";
import { createConnection } from "./connection";
import { Logger } from "winston";
import { winstonLogger } from "../shared/logger";
import { config } from "../config";
import { processTeamScores } from "../utils/processTeamScores";

const subscribeMessages = async (channel: Channel): Promise<void> => {
    const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'subscriber', 'debug');

    try {
      if (!channel) {
        channel = (await createConnection()) as Channel;
      }

      const exchangeName = 'yorker-app';
      const routingKey = 'process-match-scores';
      const queueName = 'process-match-scores-queue';
      await channel.assertExchange(exchangeName, 'direct');
      const processScoresQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
      await channel.bindQueue(processScoresQueue.queue, exchangeName, routingKey);
      channel.consume(processScoresQueue.queue, async (msg: ConsumeMessage | null) => {
        const { data } = JSON.parse(msg!.content.toString()) as { data: { matchId: string } };
        log.info(`Payload received in ${queueName} : ${data}`);
        processTeamScores(data.matchId);

        channel.ack(msg!);
      });
    } catch (error) {
        log.error(error);
    }
  };

export {subscribeMessages};