import { KafkaClient, Producer, Consumer } from 'kafka-node';
import { INeed, IServiceStatus } from './types';

export default class Kafka {
  private static _instance: Kafka = null;
  private client: KafkaClient;
  private producer: Producer;

  // TODO: close consumers

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

  private getConsumer(topic: string, timeoutInMilliseconds: number): Consumer {
    const consumer = new Consumer(
      this.client,
      [
          { topic },
      ],
      {
          groupId: topic,
          fetchMaxWaitMs: timeoutInMilliseconds,
          autoCommit: true,
      },
    );
    return consumer;
  }

  public async getStatus(): Promise<IServiceStatus> {
    return new Promise<IServiceStatus>((resolve: (value?: any) => void, reject: (reason?: any) => void) => {
      this.client.loadMetadataForTopics(['generic'], (err: any, res: any) => {
        // TODO: add hosts console.log(res[0]['1']);
        resolve({ connected: !err });
      });
    });
  }

  public async sendNeed(topics: string[], need: INeed) {
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

  public async sendMessage(topic: string, messages: string) {
    const producer = await this.getProducer();
    const payloads = [
      {topic, messages},
    ];
    return new Promise((resolve, reject) => {
      producer.send(payloads, (err: any, data: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  public async createTopic(topic: string): Promise<void> {
    const producer = await this.getProducer();
    return new Promise<void>((resolve, reject) => {
      producer.createTopics([topic], true, (err: any, data: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public getMessages(topic: string, timeoutInMilliseconds: number): Promise<string[]> {
    const consumer = this.getConsumer(topic, timeoutInMilliseconds);
    const messages: string[] = [];
    const messagesPromise =  new Promise<string[]>((resolve, reject) => {
      consumer.on('message', (message) => {
        messages.push(message.value.toString());
        if (message.offset === (message.highWaterOffset - 1)) {
          // tslint:disable-next-line:no-console
          consumer.close(true, () => console.log('consumer was closed'));
          resolve(messages);
        }
      });
    });
    const timeoutPromise = new Promise<string[]>((resolve) => setTimeout(() =>  {
      resolve(messages);
    }, timeoutInMilliseconds));
    return Promise.race([messagesPromise, timeoutPromise]);
  }
}
