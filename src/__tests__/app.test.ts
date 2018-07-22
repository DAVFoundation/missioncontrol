
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import app from '../app';

chai.use(chaiHttp);
const expect = chai.expect;

describe('baseRoute', () => {

  it('should be json', () => {
    return chai.request(app).get('/')
    .then(res => {
      expect(res.type).to.eql('application/json');
    });
  });

  it('should have a message prop', () => {
    return chai.request(app).get('/')
    .then(res => {
      expect(res.body.message).to.eql('DAV Network Node');
    });
  });

});