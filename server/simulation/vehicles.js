const { generateRandom } = require('./drone');

const generateRandomVehicles = (coords, radius = 2000) => {
  // Number of vehicles to generate
  const vehicleCount = 4;

  let vehicles = [];
  for (let i = 0; i < vehicleCount; i++) {
    vehicles.push(generateRandom({coords, radius}));
  }
  return vehicles;
};

module.exports = {
  generateRandomVehicles
};
