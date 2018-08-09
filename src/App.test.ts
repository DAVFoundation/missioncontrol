import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { cassandraDriver } from './mocks/cassandra-driver';
jest.doMock('cassandra-driver', cassandraDriver);
import { kafkaNode } from './mocks/kafka-node';
import { Application } from 'express';
jest.doMock('kafka-node', kafkaNode);

chai.use(chaiHttp);
const expect = chai.expect;

describe('baseRoute', () => {

  let app: Application;

  beforeAll(async () => {
    app =  (await import('./App')).default;
  });


  // TODO: You could create a container suite. Include all suites in it and use a single 'beforeEach' when it is duplicated.
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should be json', () => {
    // TODO: Prefer using async/await syntax over return Promise
    return chai.request(app).get('/')
      .then((res) => {
        expect(res.type).to.eql('application/json');
      });
  });

  it('should have a message prop', () => {
    return chai.request(app).get('/')
      .then((res) => {
        expect(res.body.message).to.eql('DAV Network Node');
      });
  });
});

describe('status', () => {

  let app: Application;

  beforeAll(async () => {
    app =  (await import('./App')).default;
  });

  // TODO: Expected values are usually per test - not suite.
  const expectedResult = {
    app: { connected: true },
    kafka: { connected: true },
    cassandra: {
      connected: true,
      hosts: [{address: 'localhost', connections: 0, queries: 1}],
    },
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should return status connected', async () => {
    const res = await chai.request(app).get('/health');
    expect(res.body.message).to.eql(expectedResult);
  });

});

describe('provider', () => {

  let app: Application;

  beforeAll(async () => {
    app =  (await import('./App')).default;
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
    protocol: 'drone_delivery'};

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should save provider', async () => {
    const res = await chai.request(app).post('/needsForType/topic1').send(requestData);
    expect(res.body.message).to.eql('Provider was saved');
  });

});

describe('need', () => {

  let app: Application;

  beforeAll(async () => {
    app =  (await import('./App')).default;
  });

  const requestData = {
    davId: 'david2',
    location: {
      latitude: 43.331,
      longitude: 82.762,
    },
    protocol: 'drone_delivery',
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should published need', async () => {
    const res = await chai.request(app).post('/publishNeed/topic2').send(requestData);
    expect(res.body.message).to.eql('Need was published');
  });

});

describe('kafka', () => {

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  describe('createTopic method', () => {

    it('should create topic without errors', async () => {
      const clientMock = {
        on: (state: string, cb: any) => cb(),
      };

      const producerMock = {
        on: jest.fn((state: string, cb: any) => cb()),
        createTopics: jest.fn((topics: string[], async: boolean, cb: (error: any, data: any) => any) => {
          if (topics[0] === 'testTopic') {
            cb(null, null);
          } else {
            cb('error', null);
          }
        }),
      };

      jest.doMock('kafka-node', () => ({
          KafkaClient: jest.fn().mockImplementation(() => {
            return clientMock;
          }),
          Producer: jest.fn().mockImplementation(() => {
            return producerMock;
          }),
      }));
      const app =  (await import('./App')).default;
      const res = await chai.request(app).post('/topic/create/testTopic');

      expect(res.status).to.eql(200);
      expect(res.body.message).to.eql('Topic was created');
    });

    it('should get error in create topic', async () => {
      const clientMock = {
        on: (state: string, cb: any) => cb(),
      };

      const producerMock = {
        on: jest.fn((state: string, cb: any) => cb()),
        createTopics: jest.fn((topics: string[], async: boolean, cb: (error: any, data: any) => any) => {
          if (topics[0] === 'testTopic') {
            cb('error', null);
          } else {
            cb(null, null);
          }
        }),
      };

      jest.doMock('kafka-node', () => ({
          KafkaClient: jest.fn().mockImplementation(() => {
            return clientMock;
          }),
          Producer: jest.fn().mockImplementation(() => {
            return producerMock;
          }),
      }));
      const app =  (await import('./App')).default;
      const res = await chai.request(app).post('/topic/create/testTopic');

      expect(res.status).to.eql(500);
    });
  });

  describe('sendMessage method', () => {

    it('should send message without errors', async () => {
      const clientMock = {
        on: (state: string, cb: any) => cb(),
      };

      const producerMock = {
        on: jest.fn((state: string, cb: any) => cb()),
        send: jest.fn((payloads: Array<{ topic: string, messages: string }>, cb: (error: any, data: any) => any) => {
          if (payloads[0].topic === 'testTopic') {
            cb(null, null);
          } else {
            cb('error', null);
          }
        }),
      };

      jest.doMock('kafka-node', () => ({
          KafkaClient: jest.fn().mockImplementation(() => {
            return clientMock;
          }),
          Producer: jest.fn().mockImplementation(() => {
            return producerMock;
          }),
      }));
      const app =  (await import('./App')).default;
      const res = await chai.request(app).post('/topic/publish/testTopic');

      expect(res.status).to.eql(200);
      expect(res.body.message).to.eql('Message was sent');
    });

    it('should get error in send message', async () => {
      const clientMock = {
        on: (state: string, cb: any) => cb(),
      };

      const producerMock = {
        on: jest.fn((state: string, cb: any) => cb()),
        send: jest.fn((payloads: Array<{ topic: string, messages: string }>, cb: (error: any, data: any) => any) => {
          if (payloads[0].topic === 'testTopic') {
            cb('error', null);
          } else {
            cb(null, null);
          }
        }),
      };

      jest.doMock('kafka-node', () => ({
          KafkaClient: jest.fn().mockImplementation(() => {
            return clientMock;
          }),
          Producer: jest.fn().mockImplementation(() => {
            return producerMock;
          }),
      }));
      const app =  (await import('./App')).default;
      const res = await chai.request(app).post('/topic/publish/testTopic');

      expect(res.status).to.eql(500);
    });
  });

  describe ('getMessages method', () => {

    it('should get one message without errors', async () => {
      const clientMock = {
        on: (state: string, cb: any) => cb(),
      };

      const messageContentObject = JSON.stringify({protocol: 'drone-charging', type: 'bid', price: '3'});
      const consumerMock = {
        on: jest.fn((state: string, cb: any) => {
          cb({topic: 'topicTest', value: messageContentObject, offset: 0, highWaterOffset: 1});
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
      const app =  (await import('./App')).default;
      const res = await chai.request(app).get('/topic/consume/testTopic').query({timeout: 1000});

      expect(res.status).to.eql(200);
      expect(res.body).to.eql([messageContentObject]);
    });

    it('should get two message without errors', async () => {
      const clientMock = {
        on: (state: string, cb: any) => cb(),
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
      };

      jest.doMock('kafka-node', () => ({
          KafkaClient: jest.fn().mockImplementation(() => {
            return clientMock;
          }),
          Consumer: jest.fn().mockImplementation(() => {
            return consumerMock;
          }),
      }));
      const app =  (await import('./App')).default;
      const res = await chai.request(app).get('/topic/consume/testTopic').query({timeout: 1000});

      expect(res.status).to.eql(200);
      expect(res.body).to.eql([messageContentObject, secondMessageContentObject]);
    });

    it('should get timeout due to empty topic', async () => {
      const clientMock = {
        on: (state: string, cb: any) => cb(),
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
      const app =  (await import('./App')).default;
      const res = await chai.request(app).get('/topic/consume/testTopic').query({timeout: 1000});

      expect(res.status).to.eql(200);
      expect(res.body).to.eql([]);
    });
  });
});
