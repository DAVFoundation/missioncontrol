const thrift = require('thrift');
const StatusReport = require('./thrift/StatusReport.js');
// const StatusReport_types = require('./thrift/StatusReport_types.js');

const server = thrift.createServer(StatusReport, {
  report_status: (authenticationToken, vehicleID, state, result) => {
    result(null);
  }
});

server.listen(9090);
