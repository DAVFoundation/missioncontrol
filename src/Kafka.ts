import { KafkaClient, Producer } from 'kafka-node';
import { INeed, IServiceStatus } from './types';

export default class Kafka {
  private static _instance: Kafka = null;
  private client: KafkaClient;
  private producer: Producer;

  public static getInstance(): Kafka {
    if (Kafka._instance === null) {
      Kafka._instance = new Kafka();
    }
    return Kafka._instance;
  }
  private constructor() {
    this.client = new KafkaClient({ kafkaHost: 'kafka:9092' });
  }

  private async getProducer(): Promise<Producer> {
    if (!this.producer) {
      this.producer = new Producer(this.client);
      await new Promise<Producer>((resolve: (value?: any) => void, reject: (reason?: any) => void) => {
        this.producer.on('ready', () => resolve());
        this.producer.on('error', (err) => reject(err));
      });
    }
    return this.producer;
  }

  public async getStatus(): Promise<IServiceStatus> {
    return new Promise<IServiceStatus>((resolve: (value?: any) => void, reject: (reason?: any) => void) => {
      this.client.loadMetadataForTopics(['generic'], (err: any, res: any) => {
        // TODO: add hosts console.log(res[0]['1']);
        resolve({ connected: !err });
      });
    });
  }

  public async sendMessages(topics: string[], need: INeed) {
    const producer = await this.getProducer();
    const payloads = topics.map((topic) => {
      return {
        topic,
        // TODO: (not for now) - create a SerDe mechanism for protocol
        messages: JSON.stringify(need),
      };
    });
    return new Promise((resolve, reject) => {
      producer.send(payloads, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}
