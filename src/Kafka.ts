import { KafkaNode as Kafka, IConfig } from 'dav-js';
import { ProduceRequest } from 'kafka-node';
import { IServiceStatus } from './types';

const kafka: Kafka = new Kafka();
const config: IConfig = { kafkaSeedUrls: [process.env.KAFKA_HOST || 'localhost:9092'] };

export default {
  createTopic: (topicId: string) => kafka.createTopic(topicId, config),
  sendMessage: (topicId: string, message: string) => kafka.sendMessage(topicId, message, config),
  sendPayloads: (payloads: ProduceRequest[]) => kafka.sendPayloads(payloads, config),
  rawMessages: (topicId: string) => kafka.rawMessages(topicId, config),
  getStatus: async (): Promise<IServiceStatus> => {
    try {
      await kafka.isConnected(config);
      return { connected: true };
    } catch (err) {
      return { connected: false };
    }
  },
};
