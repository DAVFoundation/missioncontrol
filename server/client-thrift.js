const thrift = require('thrift');
const StatusReport = require('./thrift/StatusReport.js');
const Registration = require('./thrift/Registration.js');

const services = {
  Registration,
  StatusReport,
};

// Connection settings
const host = 'localhost';
const transport = thrift.TBufferedTransport;
const protocol = thrift.TBinaryProtocol;

const mp = new thrift.Multiplexer();
let connection;
let clients = {};

const start = ({port = 9090} = {}) => {
  connection = thrift.createConnection(host, port, {
    transport: transport,
    protocol: protocol,
  });

  connection.on('error', function(err) {
    console.log('Connection error');
    console.log(err);
  });
  return connection;
};

const getClient = (service) => {
  if (!clients[service]) {
    clients[service] = mp.createClient(service, services[service], connection);
  }
  return clients[service];
};

module.exports = {
  start,
  getClient,
};
