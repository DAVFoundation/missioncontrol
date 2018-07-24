import { KafkaClient } from 'kafka-node';

class Kafka {
  private client: KafkaClient;
  constructor() {
    this.client = new KafkaClient({ kafkaHost: 'kafka:9092' });
  }

  async getStatus(): Promise<any> {
    return new Promise<any>((resolve: Function, reject: Function) => {
      this.client.loadMetadataForTopics(["generic"], (err: any, res: any) => {
        if (err) {
          resolve({
            connected: false
          });
        } else {
          resolve({
            connected: true
          });
        }
      });
    });
  }
}

export default new Kafka();