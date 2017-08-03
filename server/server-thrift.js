const thrift = require('thrift');
const StatusReport = require('./thrift/StatusReport.js');
// const StatusReport_types = require('./thrift/StatusReport_types.js');

const server = thrift.createServer(StatusReport, {

  is_registered: (authenticationToken, vehicleID, result) => {
    result(null, true);
  },

  report_status: (authenticationToken, vehicleID, state, result) => {
    result(null);
  }

});

module.exports = {
  start: ({port = 9090} = {}) => {
    server.listen(port);
    console.log(`Thrift server started. Listening on port ${port}`);
  }
};
