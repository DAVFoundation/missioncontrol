const thrift = require('thrift');
const StatusReport = require('./thrift/StatusReport.js');
const Registration = require('./thrift/Registration.js');
// const StatusReport_types = require('./thrift/StatusReport_types.js');

const MultiplexedProcessor = new thrift.MultiplexedProcessor();

MultiplexedProcessor.registerProcessor('Registration', new Registration.Processor({

  register_vehicle: (vehicleID, result) => {
    result(null, 'token');
  },

}));

MultiplexedProcessor.registerProcessor('StatusReport', new StatusReport.Processor({

  is_registered: (authenticationToken, vehicleID, result) => {
    result(null, false);
  },

  report_status: (authenticationToken, vehicleID, state, result) => {
    result(null);
  },

}));

const server = thrift.createMultiplexServer(MultiplexedProcessor);

module.exports = {
  start: ({port = 9090} = {}) => {
    server.listen(port);
    console.log(`Thrift server started. Listening on port ${port}`);
  }
};
