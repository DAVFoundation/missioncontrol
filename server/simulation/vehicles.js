const { generateRandom } = require('./drone');

const generateRandomVehicles = (vehicleCount = 4, coords, radius = 2000) => {
  let vehicles = [];
  for (let i = 0; i < vehicleCount; i++) {
    vehicles.push(generateRandom({coords, radius}));
  }
  return vehicles;
};

const randomBid = () => {
  return {
    bid: 0.8,
    pickup: Date.now()+(1000*60*2),
    dropoff: Date.now()+(1000*60*10),
  };
};

module.exports = {
  generateRandomVehicles,
  randomBid
};
