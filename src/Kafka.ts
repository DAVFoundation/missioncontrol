import { KafkaClient, Producer } from 'kafka-node';
import { INeed } from './types';

class Kafka {
  private client: KafkaClient;
  private producer: Producer;

  constructor() {
    this.client = new KafkaClient({ kafkaHost: 'kafka:9092' });
  }

  private async getProducer(): Promise<Producer> {
    /* TODO: replace with cleaner solution:

        if (!this.producer) {
          this.producer = new Producer(this.client);
          await new Promise<Producer>((resolve: (value?: any) => void, reject: (reason?: any) => void) => {
            this.producer.on('ready', () => resolve(this.producer));
            this.producer.on('error', (err) => reject(err));
          });
        }
        return this.producer;
    */

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

/* TODO: replace with cleaner code:

          resolve({ connected: !err });
 */
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
        // TODO: (not for now) - create a SerDe mechanism for protocol
        messages: JSON.stringify(need),
      };
    });
    // TODO: remove await here
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

// TODO: move `export default` to class Kafka
export default new Kafka();
