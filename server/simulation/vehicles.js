const { generateRandom } = require('./drone');

const getVehicles = ({coords}) => {
  // Number of vehicles to generate
  const vehicleCount = 4;
  // Max distance from given coordinates in meters
  const distance = 1000;

  let vehicles = {};
  for (let i = 0; i < vehicleCount; i++) {
    let vehicle = generateRandom({coords: coords || undefined, distance});
    vehicles[vehicle.id] = vehicle;
  }
  return vehicles;
};

module.exports = {
  getVehicles
};
