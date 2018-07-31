import { kafkaNode, failingToConnectKafkaNode, failingToSendKafkaNode } from './mocks/kafka-node';
import { INeed } from './types';

const need: INeed = {
  davId: '111',
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
    expect.assertions(1);
    jest.doMock('kafka-node', kafkaNode);
    const kafka = (await import('./Kafka')).default;
    expect(await kafka.getInstance().getStatus()).toEqual({
      connected: true,
    });
  });

  it('should not connect', async () => {
    expect.assertions(1);
    jest.doMock('kafka-node', failingToConnectKafkaNode);
    const kafka = (await import('./Kafka')).default;
    expect(await kafka.getInstance().getStatus()).toEqual({
      connected: false,
    });
  });

  it('should send messages', async () => {
    expect.assertions(1);
    jest.doMock('kafka-node', kafkaNode);
    const kafka = (await import('./Kafka')).default;
    expect(await kafka.getInstance().sendMessages([''], need)).toEqual(true);
  });

  it('should fail to send messages', async () => {
    // expect.assertions(1);
    jest.doMock('kafka-node', failingToSendKafkaNode);
    const kafka = (await import('./Kafka')).default;
    await expect(kafka.getInstance().sendMessages([], need)).rejects.toEqual(Error('Failed to send'));
  });

});
