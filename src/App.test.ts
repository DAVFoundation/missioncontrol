import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { cassandraDriver } from './mocks/cassandra-driver';
jest.doMock('cassandra-driver', cassandraDriver);
import { kafkaNode } from './mocks/kafka-node';
jest.doMock('kafka-node', kafkaNode);
import app from './App';

chai.use(chaiHttp);
const expect = chai.expect;

describe('baseRoute', () => {

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
