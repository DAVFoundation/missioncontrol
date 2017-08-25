const { generateRandomVehicles } = require('../simulation/vehicles');

export const getVehiclesInRange = (coords) => {
  return generateRandomVehicles(coords);
};
