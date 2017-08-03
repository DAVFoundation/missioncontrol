const thrift = require('thrift');
const StatusReport = require('./thrift/StatusReport.js');
// const StatusReport_types = require('./thrift/StatusReport_types.js');

// Connection settings
const host = 'localhost';
const transport = thrift.TBufferedTransport;
const protocol = thrift.TBinaryProtocol;

let connection;

module.exports = {
  start: ({port = 9090} = {}) => {
    connection = thrift.createConnection(host, port, {
      transport: transport,
      protocol: protocol,
    });

    connection.on('error', function(err) {
      console.log('Connection error');
      console.log(err);
    });
    return connection;
  },

  getClient: () => thrift.createClient(StatusReport, connection),
};
