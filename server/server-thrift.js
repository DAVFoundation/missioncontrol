const thrift = require('thrift');
const StatusReport = require('./thrift/StatusReport');
const Registration = require('./thrift/Registration');
const VehicleCreation = require('./thrift/VehicleCreation');

const MultiplexedProcessor = new thrift.MultiplexedProcessor();

MultiplexedProcessor.registerProcessor('Registration', new Registration.Processor({

  register_vehicle: (vehicleDetails, result) => {
    result(null, 'token');
  },

  deregister_vehicle: (vehicleID, result) => {
    result(null, 'token');
  },

  vehicle_is_registered: (vehicleID, result) => {
    result(null, false);
  },

}));

MultiplexedProcessor.registerProcessor('StatusReport', new StatusReport.Processor({

  report_status: (vehicleID, state, result) => {
    result(null);
  },

}));

MultiplexedProcessor.registerProcessor('VehicleCreation', new VehicleCreation.Processor({

  create_vehicle: (vehicleDetails, result) => {
    console.log('Mock thrift server received create_vehicle: ', vehicleDetails.vehicleId.UID);
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
