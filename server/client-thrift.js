const thrift = require('thrift');
const StatusReport = require('./thrift/StatusReport.js');
// const StatusReport_types = require('./thrift/StatusReport_types.js');

// Connection settings
const host = 'localhost';
const port = 9090;
const transport = thrift.TBufferedTransport;
const protocol = thrift.TBinaryProtocol;

const connection = thrift.createConnection(host, port, {
  transport: transport,
  protocol: protocol,
});

connection.on('error', function(err) {
  console.log('Connection error');
  console.log(err);
});

module.exports = {
  getClient: () => thrift.createClient(StatusReport, connection),
};
