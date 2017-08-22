const { generateRandom } = require('./drone');

const getVehicles = ({coords}) => {
  // Number of vehicles to generate
  const vehicleCount = 4;
  // Max distance from given coordinates in meters to generate vehicles in
  const distance = 1000;
  // Coordinates to generate vehicles around
  coords = coords || {lat: 47.166167, long: 8.515495};

  let vehicles = [];
  for (let i = 0; i < vehicleCount; i++) {
    vehicles.push(generateRandom({coords, distance}));
  }
  return vehicles;
};

module.exports = {
  getVehicles
};
