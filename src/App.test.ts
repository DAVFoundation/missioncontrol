import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { cassandraDriver } from './mocks/cassandra-driver';
jest.doMock('cassandra-driver', cassandraDriver);
import app from './App';

chai.use(chaiHttp);
const expect = chai.expect;

describe('baseRoute', () => {

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should be json', () => {
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
