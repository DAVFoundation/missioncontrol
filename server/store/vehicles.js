const redis = require('./redis');

const { generateRandomVehicles } = require('../simulation/vehicles');

const addNewVehicle = vehicle => {
  // Add to positions
  redis.geoaddAsync('positions', vehicle.coords.long, vehicle.coords.lat, vehicle.id);
  // Add to vehicles
  redis.hmsetAsync(`vehicles:${vehicle.id}`,
    'id', vehicle.id,
    'model', vehicle.model,
    'icon', vehicle.icon,
    'long', vehicle.coords.long,
    'lat', vehicle.coords.lat,
    'rating', vehicle.rating,
    'missions_completed', vehicle.missions_completed,
    'missions_completed_7_days', vehicle.missions_completed_7_days,
  );
  // @TODO: Send new vehicles to Captain
};

const generateAndAddVehicles = (count, coords, radius) =>
  count > 0 && generateRandomVehicles(count, coords, radius)
    .forEach(vehicle => {
      addNewVehicle(vehicle);
    });


const getVehiclesInRange = async (coords, radius) => {
  const shortRangeRadius = radius/7;
  const desiredVehicleCountInShortRange = 3;
  const desiredVehicleCountInLongRange = 100;

  // get list of known vehicles in short range
  const vehiclesInShortRange = await redis.georadiusAsync('positions', coords.long, coords.lat, shortRangeRadius, 'm');
  // if not enough vehicles in short range generate new ones
  generateAndAddVehicles(desiredVehicleCountInShortRange - vehiclesInShortRange.length, coords, shortRangeRadius);

  // get list of known vehicles in long range
  const vehiclesInLongRange = await redis.georadiusAsync('positions', coords.long, coords.lat, radius, 'm');
  // if not enough vehicles in long range generate new ones
  generateAndAddVehicles(desiredVehicleCountInLongRange - vehiclesInLongRange.length, coords, radius);

  // get details for vehicles in range
  let vehicles = await Promise.all(
    vehiclesInLongRange.map(
      vehicleId => redis.hgetallAsync(`vehicles:${vehicleId}`)
    )
  );

  // Prepare response
  return vehicles
    // filter vehicles
    .filter(vehicle => !!vehicle)
    // format response objects
    .map(
      vehicle => ({
        id: vehicle.id,
        model: vehicle.model,
        icon: vehicle.icon,
        coords: {lat: parseFloat(vehicle.lat), long: parseFloat(vehicle.long)},
        rating: parseFloat(vehicle.rating),
        missions_completed: parseInt(vehicle.missions_completed),
        missions_completed_7_days: parseInt(vehicle.missions_completed_7_days),
      })
    );
};

module.exports = {
  getVehiclesInRange
};
