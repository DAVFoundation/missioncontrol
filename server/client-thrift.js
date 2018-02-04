const thrift = require('thrift');
const VehicleCreation = require('./thrift/VehicleCreation');
const Registration = require('./thrift/Registration');
const VehicleTypes = require('./thrift/Vehicle_types');
const DAVUserTypes = require('./thrift/DAVUser_types');
const TypesTypes = require('./thrift/Types_types');

const services = {
  VehicleCreation,
  Registration,
};

// Connection settings
const transport = thrift.TBufferedTransport;
const protocol = thrift.TBinaryProtocol;

const mp = new thrift.Multiplexer();
let connection;
let clients = {};

const start = ({ port = 9090, host = 'localhost' } = {}) => {
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

const getClient = service => {
  if (!clients[service]) {
    clients[service] = mp.createClient(service, services[service], connection);
  }
  return clients[service];
};

const vehicleIsRegistered = () => {
  return getClient('Registration').vehicle_is_registered();
};

const createVehicle = vehicle => {
  let davUser = new DAVUserTypes.DAVUser();
  davUser.UID = vehicle.id;

  let coordinates = new TypesTypes.Coordinates();
  coordinates.longitude = vehicle.coords.long;
  coordinates.latitude = vehicle.coords.lat;

  let vehicleDetails = new VehicleTypes.VehicleDetails();
  vehicleDetails.vehicleId = davUser;
  vehicleDetails.model = vehicle.model;
  vehicleDetails.missions_completed = vehicle.missions_completed;
  vehicleDetails.missions_completed_7_days = vehicle.missions_completed_7_days;
  vehicleDetails.coordinates = coordinates;

  return getClient('VehicleCreation').create_vehicle(vehicleDetails);
};

module.exports = {
  start,
  vehicleIsRegistered,
  createVehicle,
};
