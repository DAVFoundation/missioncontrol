const { generateRandom } = require('./simulation/drone');

const getVehicles = () => {
  const vehicleCount = 4;
  let vehicles = {};
  for (let i = 0; i < vehicleCount; i++) {
    let vehicle = generateRandom();
    vehicles[vehicle.id] = vehicle;
  }
  return vehicles;
};

module.exports = {
  getVehicles
};
