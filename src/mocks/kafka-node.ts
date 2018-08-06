// TODO: Creating a complex mock is error-prone and reduces test readability and maintenance

import { EventEmitter } from 'events';

// tslint:disable:max-classes-per-file
export class KafkaClient {

  constructor(options: any) {
    return;
  }

  public loadMetadataForTopics(topics: string[], cb: (error: any, data: any) => any): void {
    cb(null, true);
  }
}

export class FailingToConnectClient extends KafkaClient {
  public loadMetadataForTopics(topics: string[], cb: (error: any, data: any) => any): void {
    cb(true, null);
  }
}

export class Producer extends EventEmitter {

  constructor() {
    super();
    setTimeout(() => this.emit('ready'), 100);
  }

  public send(payloads: IProduceRequest[], cb: (error: any, data: any) => any): void {
    cb(null, true);
  }
}

export class FailingToSendProducer extends Producer {
  public send(payloads: IProduceRequest[], cb: (error: any, data: any) => any): void {
    cb(Error('Failed to send'), null);
  }
}

export interface IProduceRequest {
  topic: string;
  messages: any; // string[] | Array<KeyedMessage> | string | KeyedMessage
  key?: any;
  partition?: number;
  attributes?: number;
}

export const kafkaNode = () => {
  return {
    KafkaClient,
    Producer,
  };
};

export const failingToConnectKafkaNode = () => {
  return {
    KafkaClient: FailingToConnectClient,
    Producer,
  };
};

export const failingToSendKafkaNode = () => {
  return {
    KafkaClient,
    Producer: FailingToSendProducer,
  };
};

