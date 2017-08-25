const { generateRandom } = require('./drone');

const generateRandomVehicles = (vehicleCount = 4, coords, radius = 2000) => {
  let vehicles = [];
  for (let i = 0; i < vehicleCount; i++) {
    vehicles.push(generateRandom({coords, radius}));
  }
  return vehicles;
};

module.exports = {
  generateRandomVehicles
};
