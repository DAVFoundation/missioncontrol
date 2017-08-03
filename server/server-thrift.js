const thrift = require('thrift');
const StatusReport = require('./thrift/StatusReport.js');
// const StatusReport_types = require('./thrift/StatusReport_types.js');

const port = 9090;

const server = thrift.createServer(StatusReport, {
  report_status: (authenticationToken, vehicleID, state, result) => {
    result(null);
  }
});

module.exports = {
  start: () => {
    server.listen(port);
    console.log(`Thrift server started. Listening on port ${port}`);
  }
};
