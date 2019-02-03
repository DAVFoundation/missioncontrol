import { Observable } from 'rxjs';
import {
  cassandraDriver,
  cassandraFailingToConnectDriver,
} from './mocks/cassandra-driver';
jest.doMock('cassandra-driver', cassandraDriver);
import { Application } from 'express';

import chai = require('chai');
import chaiHttp = require('chai-http');
chai.use(chaiHttp);

const expect = chai.expect;

const kafkaMock = {
  createTopic: jest.fn(() => Promise.resolve()),
  sendMessage: jest.fn(() => Promise.resolve()),
  sendPayloads: jest.fn(() => Promise.resolve()),
  rawMessages: jest.fn(() => Promise.resolve()),
  isConnected: jest.fn(() => Promise.resolve(true)),
};

const kafkaFailingToConnectMock = {
  createTopic: jest.fn(() => Promise.resolve()),
  sendMessage: jest.fn(() => Promise.resolve()),
  sendPayloads: jest.fn(() => Promise.resolve()),
  rawMessages: jest.fn(() => Promise.resolve()),
  isConnected: () => {
    throw new Error('No Kafka, sorry');
  },
};

jest.doMock('dav-js', () => ({ KafkaNode: jest.fn(() => kafkaMock) }));

describe('App', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  describe('baseRoute', () => {
    let app: Application;

    beforeAll(async () => {
      app = (await import('./App')).default;
    });

    it('should return HTTP 200', async () => {
      const res = await chai.request(app).get('/');
      expect(res.status).to.eql(200);
    });

    it('should be json', async () => {
      const res = await chai.request(app).get('/');
      expect(res.type).to.eql('application/json');
    });

    it('should have a message prop', async () => {
      const res = await chai.request(app).get('/');
      expect(res.body.message).to.eql('DAV Network Node');
    });
  });

  describe('status (ok)', () => {
    let app: Application;
    beforeAll(async () => {
      app = (await import('./App')).default;
    });

    // TODO: Expected values are usually per test - not suite.
    const expectedResult = {
      app: { connected: true },
      kafka: { connected: true },
      cassandra: {
        connected: true,
        hosts: [{ address: 'localhost', connections: 0, queries: 1 }],
      },
    };

    it('should return status connected', async () => {
      const res = await chai.request(app).get('/health');
      expect(res.body.message).to.eql(expectedResult);
    });

    it('should return connected status for the app itself', async () => {
      const res = await chai.request(app).get('/health');
      expect(res.body.message.app.connected).to.eql(true);
    });

    it('should return connected status for Kafka', async () => {
      const res = await chai.request(app).get('/health');
      expect(res.body.message.kafka.connected).to.eql(true);
    });
  });
  describe('status (failure)', () => {
    let app: Application;
    beforeAll(async () => {
      jest.doMock('cassandra-driver', cassandraFailingToConnectDriver);
      jest.doMock('dav-js', () => ({
        KafkaNode: jest.fn(() => kafkaFailingToConnectMock),
      }));
      app = (await import('./App')).default;
    });

    it('should return status HTTP 503 when there is no Cassandra', async () => {
      const res = await chai.request(app).get('/health');
      expect(res.status).to.eql(503);
    });

    it('should return connected status for the app itself even if something is failing', async () => {
      const res = await chai.request(app).get('/health');
      expect(res.body.message.app.connected).to.eql(true);
    });

    it('should return error when there is no Cassandra', async () => {
      const res = await chai.request(app).get('/health');
      expect(res.body.message.cassandra.connected).to.eql(false);
    });

    it('should return error when there is no Kafka', async () => {
      const res = await chai.request(app).get('/health');
      expect(res.body.message.kafka.connected).to.eql(false);
    });

    afterAll(async () => {
      jest.doMock('cassandra-driver', cassandraDriver);
      jest.doMock('dav-js', () => ({ KafkaNode: jest.fn(() => kafkaMock) }));
    });
  });

  describe('provider', () => {
    let app: Application;

    beforeAll(async () => {
      app = (await import('./App')).default;
    });

    // TODO: Should this maybe be in a test - not suite.
    const requestData = {
      davId: 'david1',
      area: {
        min: { latitude: 43.331, longitude: 82.762 },
        max: { latitude: 43.396312072116764, longitude: 83.08981250773137 },
      },
      dimensions: {
        length: 1,
        width: 1,
        height: 1,
      },
      protocol: 'drone_delivery',
    };

    it('should save provider', async () => {
      const res = await chai
        .request(app)
        .post('/needsForType/topic1')
        .send(requestData);
      expect(res.body.message).to.eql('Provider was saved');
    });
  });

  describe('need', () => {
    let app: Application;

    beforeAll(async () => {
      app = (await import('./App')).default;
    });

    const requestData = {
      davId: 'david2',
      location: {
        latitude: 43.331,
        longitude: 82.762,
      },
      protocol: 'drone_delivery',
    };

    it('should published need', async () => {
      const res = await chai
        .request(app)
        .post('/publishNeed/topic2')
        .send(requestData);
      expect(res.body.message).to.eql('Need was published');
    });
  });

  describe('kafka', () => {
    describe('createTopic method', () => {
      it('should create topic without errors', async () => {
        const app = (await import('./App')).default;
        const res = await chai.request(app).post('/topic/create/testTopic');

        expect(res.status).to.eql(200);
        expect(res.body.message).to.eql('Topic was created');
      });

      it('should get error in create topic', async () => {
        kafkaMock.createTopic.mockRejectedValue('');

        const app = (await import('./App')).default;
        const res = await chai.request(app).post('/topic/create/testTopic');

        expect(res.status).to.eql(500);
      });
    });

    describe('sendMessage method', () => {
      it('should send message without errors', async () => {
        const app = (await import('./App')).default;
        const res = await chai.request(app).post('/topic/publish/testTopic');

        expect(res.status).to.eql(200);
        expect(res.body.message).to.eql('Message was sent');
      });

      it('should get error in send message', async () => {
        kafkaMock.sendMessage.mockRejectedValue('');

        const app = (await import('./App')).default;
        const res = await chai.request(app).post('/topic/publish/testTopic');

        expect(res.status).to.eql(500);
      });
    });

    describe('getMessages method', () => {
      it('should get one message without errors', async () => {
        const messageContentObject = JSON.stringify({
          protocol: 'drone-charging',
          type: 'bid',
          price: '3',
        });
        const messages = Observable.from([
          {
            topic: 'topicTest',
            value: messageContentObject,
            offset: 0,
            highWaterOffset: 1,
          },
        ]);
        kafkaMock.rawMessages.mockResolvedValue(messages);
        const app = (await import('./App')).default;
        const res = await chai
          .request(app)
          .get('/topic/consume/testTopic')
          .query({ timeout: 1000 });

        expect(res.status).to.eql(200);
        expect(res.text).to.eql(JSON.stringify([messageContentObject]));
      });

      it('should get two message without errors', async () => {
        const firstMessageContentObject = JSON.stringify({
          protocol: 'drone-charging',
          type: 'bid',
          price: '3',
        });
        const secondMessageContentObject = JSON.stringify({
          protocol: 'drone-delivering',
          type: 'bid',
          price: '34',
        });
        const firstMessage = {
          topic: 'topic',
          value: firstMessageContentObject,
          offset: 0,
          highWaterOffset: 2,
        };
        const secondMessage = {
          topic: 'topic',
          value: secondMessageContentObject,
          offset: 1,
          highWaterOffset: 2,
        };
        const messages = Observable.from([firstMessage, secondMessage]);
        kafkaMock.rawMessages.mockResolvedValue(messages);

        const app = (await import('./App')).default;
        const res = await chai
          .request(app)
          .get('/topic/consume/testTopic')
          .query({ timeout: 1000 });

        expect(res.status).to.eql(200);
        expect(res.text).to.eql(
          JSON.stringify([
            firstMessageContentObject,
            secondMessageContentObject,
          ]),
        );
      });

      it('should get timeout due to empty topic', async () => {
        const messages = Observable.from([]);
        kafkaMock.rawMessages.mockResolvedValue(messages);
        const app = (await import('./App')).default;
        const res = await chai
          .request(app)
          .get('/topic/consume/testTopic')
          .query({ timeout: 1000 });

        expect(res.status).to.eql(200);
        expect(res.text).to.eql(JSON.stringify([]));
      });
    });
  });
});
