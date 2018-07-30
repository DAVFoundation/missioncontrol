import { KafkaClient, Producer } from 'kafka-node';
import { INeed } from './types';

class Kafka {
  private client: KafkaClient;
  private producer: Producer;

  constructor() {
    this.client = new KafkaClient({ kafkaHost: 'kafka:9092' });
  }

  private async getProducer(): Promise<Producer> {
    if (this.producer) {
      return this.producer;
    } else {
      this.producer = new Producer(this.client);
      return new Promise<Producer>((resolve: (value?: any) => void, reject: (reason?: any) => void) => {
        this.producer.on('ready', () => resolve(this.producer));
        this.producer.on('error', (err) => reject(err));
      });
    }
  }

  public async getStatus(): Promise<boolean> {
    return new Promise<boolean>((resolve: (value?: any) => void, reject: (reason?: any) => void) => {
      this.client.loadMetadataForTopics(['generic'], (err: any, res: any) => {
        if (err) {
          resolve({
            connected: false,
          });
        } else {
          resolve({
            connected: true,
          });
        }
      });
    });
  }

  public async sendMessages(topics: string[], need: INeed) {
    const producer = await this.getProducer();
    const payloads = topics.map((topic) => {
      return {
        topic,
        messages: JSON.stringify(need),
      };
    });
    return await new Promise((resolve, reject) => {
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

export default new Kafka();
