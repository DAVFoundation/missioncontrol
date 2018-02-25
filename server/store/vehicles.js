const redis = require('./redis');
const config = require('../config');
const {generateRandomVehicles} = require('../simulation/vehicles');
const {createVehicle} = require('../client-thrift');

const parseVehiclesArray = vehicles =>
  vehicles
  // filter vehicles
    .filter(vehicle => !!vehicle)
    // format response objects
    .map(vehicle => ({
      id: vehicle.id,
      model: vehicle.model,
      icon: vehicle.icon,
      coords: {lat: parseFloat(vehicle.lat), long: parseFloat(vehicle.long)},
      missions_completed: parseInt(vehicle.missions_completed),
      missions_completed_7_days: parseInt(vehicle.missions_completed_7_days),
    }));

const addNewVehicle = vehicle => {
  // Add to vehicles
  redis.hmsetAsync(`vehicles:${vehicle.id}`,
    'id', vehicle.id,
    'model', vehicle.model,
    'icon', vehicle.icon,
    'missions_completed', vehicle.missions_completed,
    'missions_completed_7_days', vehicle.missions_completed_7_days,
    'status', vehicle.status,
  );

  updateVehiclePosition(vehicle);

  // Set TTL for vehicles
  setVehicleTTL(vehicle.id);
  // Send new vehicle to Captain
  createVehicle(vehicle);
};

const getVehicle = async id => {
  setVehicleTTL(id);
  let vehicle = await redis.hgetallAsync(`vehicles:${id}`);
  vehicle.coords = {long: vehicle.long, lat: vehicle.lat};
  return vehicle;
};

const setVehicleTTL = vehicleId => 
  redis.expire(`vehicles:${vehicleId}`, config('vehicles_ttl'));

const getVehicles = async vehicleIds =>
  parseVehiclesArray(await Promise.all(vehicleIds.map(vehicleId => getVehicle(vehicleId))),);

const updateVehicleStatus = async (id, status) => {
  return await redis.hsetAsync(`vehicles:${id}`, 'status', status);
};

const updateVehiclePosition = async (vehicle, newLong = vehicle.coords.long, newLat = vehicle.coords.lat) => {
  const positionId = await redis.incrAsync('next_position_id');
  await Promise.all([
    redis.geoaddAsync('vehicle_positions', newLong, newLat, vehicle.id),

    redis.hmsetAsync(`vehicles:${vehicle.id}`,
      'long', newLong,
      'lat', newLat,
    ),
    redis.hmsetAsync(`vehicle_position_history:${positionId}`,
      'long', newLong,
      'lat', newLat,
      'status', vehicle.status
    ),
    redis.zaddAsync(`vehicles:${vehicle.id}:positions`, Date.now(), positionId)
  ]);

};


const getPosition = async positionId => {
  const position = await redis.hgetallAsync(`vehicle_position_history:${positionId}`);
  position.position_id = positionId;
  return position;
};

const getLatestPositionUpdate = async (vehicle) => {
  return await redis.zrevrangeAsync(`vehicles:${vehicle.id}:positions`, 0, -1, 'withscores');
};

// returns the specific solo vehicle for bid creation
const generateSoloVehicleForBid = (coords) => {
  const vehicle = generateRandomVehicles(1, coords)[0];
  addNewVehicle(vehicle);
  return vehicle;
};

const generateAndAddVehicles = (count, coords, radius) =>
  count > 0 && generateRandomVehicles(count, coords, radius)
    .forEach(vehicle => {
      addNewVehicle(vehicle);
    });

const getVehiclesInRange = async (coords, radius) => {
  const shortRangeRadius = radius / 7;
  const desiredVehicleCountInShortRange = 3;
  const desiredVehicleCountInLongRange = 100;

  // get list of known vehicles in short range
  const vehiclesInShortRange = await redis.georadiusAsync('vehicle_positions', coords.long, coords.lat, shortRangeRadius, 'm');
  // if not enough vehicles in short range generate new ones
  generateAndAddVehicles(desiredVehicleCountInShortRange - vehiclesInShortRange.length, coords, shortRangeRadius);

  // get list of known vehicles in long range
  const vehiclesInLongRange = await redis.georadiusAsync('vehicle_positions', coords.long, coords.lat, radius, 'm');
  // if not enough vehicles in long range generate new ones
  generateAndAddVehicles(desiredVehicleCountInLongRange - vehiclesInLongRange.length, coords, radius);

  // get details for vehicles in range
  return await getVehicles(vehiclesInLongRange);
};

module.exports = {
  generateSoloVehicleForBid,
  getVehiclesInRange,
  getVehicle,
  getVehicles,
  updateVehicleStatus,
  updateVehiclePosition,
  getLatestPositionUpdate,
  getPosition
};
