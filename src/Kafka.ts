import { KafkaClient } from 'kafka-node';

class Kafka {
  private client: KafkaClient;
  constructor() {
    this.client = new KafkaClient({ kafkaHost: 'kafka:9092' });
  }

  public async getStatus(): Promise<any> {
    return new Promise<any>((resolve: (value?: any) => void, reject: (reason?: any) => void) => {
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
}

export default new Kafka();
