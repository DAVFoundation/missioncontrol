const { generateRandomVehicles } = require('../simulation/vehicles');

const getVehiclesInRange = (coords, radius) => {
  return generateRandomVehicles(coords, radius);
};

module.exports = {
  getVehiclesInRange
};
