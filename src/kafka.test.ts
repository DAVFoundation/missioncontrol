import { kafkaNode, failingToConnectKafkaNode, failingToSendKafkaNode, KafkaClient } from './mocks/kafka-node';
import { INeed } from './types';

const need: INeed = {
  topicId: '222',
  location: {
    longitude: 1,
    latitude: 1,
  },
  protocol: 'drone_delivery',
};

describe('kafka', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should connect', async () => {
    // TODO: `expect.assertions` is irrelevant in the case of async/await usage
    expect.assertions(1);
    jest.doMock('kafka-node', kafkaNode);
    const kafka = (await import('./Kafka')).default;
    expect(await kafka.getInstance().getStatus()).toEqual({
      connected: true,
    });
  });

  it('should not connect', async () => {
    expect.assertions(1);
    // TODO: Create mock implementation in the test
    jest.doMock('kafka-node', failingToConnectKafkaNode);
    const kafka = (await import('./Kafka')).default;
    expect(await kafka.getInstance().getStatus()).toEqual({
      connected: false,
    });
  });

  it('should send need', async () => {
    expect.assertions(1);
    jest.doMock('kafka-node', kafkaNode);
    const kafka = (await import('./Kafka')).default;
    expect(await kafka.getInstance().sendNeed([''], need)).toEqual(true);
  });

  it('should fail to send need', async () => {
    // expect.assertions(1);
    jest.doMock('kafka-node', failingToSendKafkaNode);
    const kafka = (await import('./Kafka')).default;
    await expect(kafka.getInstance().sendNeed([], need)).rejects.toEqual(Error('Failed to send'));
  });

  describe('createTopic method', () => {

    it('should createTopic when input is valid and there are no errors', async () => {

      const clientMock = {
        on: (state: string, cb: any) => cb(),
      };

      const producerMock = {
        on: jest.fn((state: string, cb: any) => cb()),
        createTopics: jest.fn((topics: string[], async: boolean, cb: (error: any, data: any) => any) => cb(null, null)),
      };

      jest.doMock('kafka-node', () => ({
          KafkaClient: jest.fn().mockImplementation(() => {
            return clientMock;
          }),
          Producer: jest.fn().mockImplementation(() => {
            return producerMock;
          }),
      }));

      const kafka = (await import('./Kafka')).default;

      await expect(kafka.getInstance().createTopic('topic')).resolves.toBeUndefined();

      expect(producerMock.on).toHaveBeenCalledWith('ready', expect.anything());
      expect(producerMock.createTopics).toHaveBeenCalledWith(['topic'], expect.any(Boolean), expect.any(Function));
    });

    it('should get error from kafka in topic creation method', async () => {

      const clientMock = {
        on: (state: string, cb: any) => cb(),
      };

      const producerMock = {
        on: jest.fn((state: string, cb: any) => cb()),
        createTopics: jest.fn((topics: string[], async: boolean, cb: (error: any, data: any) => any) => cb('error', null)),
      };

      jest.doMock('kafka-node', () => ({
          KafkaClient: jest.fn().mockImplementation(() => {
            return clientMock;
          }),
          Producer: jest.fn().mockImplementation(() => {
            return producerMock;
          }),
      }));

      const kafka = (await import('./Kafka')).default;

      await expect(kafka.getInstance().createTopic('topic')).rejects.toBe('error');

      expect(producerMock.on).toHaveBeenCalledWith('ready', expect.anything());
      expect(producerMock.createTopics).toHaveBeenCalledWith(['topic'], expect.any(Boolean), expect.any(Function));
    });
  });

  describe ('sendMessage method', () => {
    it('should send message to kafka without errors when input is valid and no errors from kafka', async () => {
      const clientMock = {
        on: (state: string, cb: any) => cb(),
      };

      const producerMock = {
        on: jest.fn((state: string, cb: any) => cb()),
        send: jest.fn((payloads: Array<{ 'topic': string, messages: string }>, cb: (error: any, data: any) => any) => cb(null, null)),
      };

      jest.doMock('kafka-node', () => ({
          KafkaClient: jest.fn().mockImplementation(() => {
            return clientMock;
          }),
          Producer: jest.fn().mockImplementation(() => {
            return producerMock;
          }),
      }));
      const kafka = (await import('./Kafka')).default;

      await expect(kafka.getInstance().sendMessage('topic', 'message')).resolves.toBeNull();
      expect(producerMock.on).toHaveBeenCalledWith('ready', expect.anything());
      expect(producerMock.send).toHaveBeenCalledWith([{ topic: 'topic', messages: 'message' }], expect.any(Function));
    });

    it('should get error from kafka in send method', async () => {
      const clientMock = {
        on: (state: string, cb: any) => cb(),
      };

      const producerMock = {
        on: jest.fn((state: string, cb: any) => cb()),
        send: jest.fn((payloads: Array<{ 'topic': string, messages: string }>, cb: (error: any, data: any) => any) => cb('error', null)),
      };

      jest.doMock('kafka-node', () => ({
          KafkaClient: jest.fn().mockImplementation(() => {
            return clientMock;
          }),
          Producer: jest.fn().mockImplementation(() => {
            return producerMock;
          }),
      }));
      const kafka = (await import('./Kafka')).default;

      await expect(kafka.getInstance().sendMessage('topic', 'message')).rejects.toBe('error');
      expect(producerMock.on).toHaveBeenCalledWith('ready', expect.anything());
      expect(producerMock.send).toHaveBeenCalledWith([{ topic: 'topic', messages: 'message' }], expect.any(Function));
    });
  });

  describe('getMessagesMethod', () => {
    it('should get one message when get valid input and no errors from kafka', async () => {
      const clientMock = {
        on: jest.fn((state: string, cb: any) => cb()),
      };

      const messageContentObject = JSON.stringify({protocol: 'drone-charging', type: 'bid', price: '3'});
      const message = {topic: 'topic', value: messageContentObject, offset: 0, highWaterOffset: 1};
      const consumerMock = {
        on: jest.fn((state: string, cb: any) => cb(message)),
        close: jest.fn(),
      };

      jest.doMock('kafka-node', () => ({
          KafkaClient: jest.fn().mockImplementation(() => {
            return clientMock;
          }),
          Consumer: jest.fn().mockImplementation(() => {
            return consumerMock;
          }),
      }));
      const kafka = (await import('./Kafka')).default;

      await expect(kafka.getInstance().getMessages('topic', 500)).resolves.toEqual([messageContentObject]);
      expect(consumerMock.on).toHaveBeenCalledWith('message', expect.any(Function));
    });

    it('should get two messages when get valid input and no errors from kafka', async () => {
      const clientMock = {
        on: jest.fn((state: string, cb: any) => cb()),
      };

      const messageContentObject = JSON.stringify({protocol: 'drone-charging', type: 'bid', price: '3'});
      const secondMessageContentObject = JSON.stringify({protocol: 'drone-delivering', type: 'bid', price: '34'});
      const firstMessage = {topic: 'topic', value: messageContentObject, offset: 0, highWaterOffset: 2};
      const secondMessage = {topic: 'topic', value: secondMessageContentObject, offset: 1, highWaterOffset: 2};
      const consumerMock = {
        on: jest.fn((state: string, cb: any) => {
          cb(firstMessage);
          cb(secondMessage);
        }),
        close: jest.fn(),
      };

      jest.doMock('kafka-node', () => ({
          KafkaClient: jest.fn().mockImplementation(() => {
            return clientMock;
          }),
          Consumer: jest.fn().mockImplementation(() => {
            return consumerMock;
          }),
      }));
      const kafka = (await import('./Kafka')).default;

      await expect(kafka.getInstance().getMessages('topic', 500)).resolves.toEqual([messageContentObject, secondMessageContentObject]);
      expect(consumerMock.on).toHaveBeenCalledWith('message', expect.any(Function));
    });

    it('should get no messages after timeout when get valid input and no errors from kafka', async () => {
      const clientMock = {
        on: jest.fn((state: string, cb: any) => cb()),
      };
      const consumerMock = {
        on: jest.fn((state: string, cb: any) => {
          return;
        }),
      };

      jest.doMock('kafka-node', () => ({
          KafkaClient: jest.fn().mockImplementation(() => {
            return clientMock;
          }),
          Consumer: jest.fn().mockImplementation(() => {
            return consumerMock;
          }),
      }));
      const kafka = (await import('./Kafka')).default;

      await expect(kafka.getInstance().getMessages('topic', 500)).resolves.toEqual([]);
      expect(consumerMock.on).toHaveBeenCalledWith('message', expect.any(Function));
    });
  });
});
