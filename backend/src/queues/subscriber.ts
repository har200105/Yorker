import { Channel, ConsumeMessage } from "amqplib";
import { createConnection } from "./connection";
import { Logger } from "winston";
import { winstonLogger } from "../shared/logger";
import { processTeamScores } from "../utils/processTeamScores";

const subscribeMessages = async (channel: Channel): Promise<void> => {
    const log: Logger = winstonLogger('queueSubscriber', 'debug');

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
        console.log("msg :",JSON.parse(msg!.content.toString()));
        const { matchId } = JSON.parse(msg!.content.toString());
        log.info(`Payload received in ${queueName} : ${matchId}`);
        processTeamScores(matchId);

        channel.ack(msg!);
      });
    } catch (error) {
        log.error(error);
    }
  };

export {subscribeMessages};