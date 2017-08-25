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

const getVehiclesInRange = async (coords, radius) => {
  // get list of known vehicles in range
  const vehiclesInRange = await redis.georadiusAsync('positions', coords.long, coords.lat, radius, 'm');

  // if not enough vehicles in range generate new ones, store them in redis, and send them to captain
  if (vehiclesInRange.length < 20) {
    const newVehicles = generateRandomVehicles(20, coords, 4000);
    newVehicles.forEach(vehicle => {
      addNewVehicle(vehicle);
    });
  }

  // get details of registered vehicles in range
  let vehicles = await Promise.all(
    vehiclesInRange.map(
      vehicleId => redis.hgetallAsync(`vehicles:${vehicleId}`)
    )
  );

  // Go over vehicles
  vehicles = vehicles
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

  return vehicles;
};

module.exports = {
  getVehiclesInRange
};
