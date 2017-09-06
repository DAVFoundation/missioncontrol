const { generateRandom } = require('./drone');
const turf = require('@turf/turf');

const generateRandomVehicles = (vehicleCount = 4, coords, radius = 2000) => {
  let vehicles = [];
  for (let i = 0; i < vehicleCount; i++) {
    vehicles.push(generateRandom({coords, radius}));
  }
  return vehicles;
};

const randomBid = (origin, pickup, dropoff) => {
  const originPoint  = turf.point([parseFloat(origin.long),  parseFloat(origin.lat)]);
  const pickupPoint  = turf.point([parseFloat(pickup.long),  parseFloat(pickup.lat)]);
  const dropoffPoint = turf.point([parseFloat(dropoff.long), parseFloat(dropoff.lat)]);
  const distanceOriginToPickup = turf.distance(originPoint, pickupPoint);
  const distancePickupToDelivery = turf.distance(pickupPoint, dropoffPoint);
  const bid = (distanceOriginToPickup+distancePickupToDelivery).toFixed(2);
  return {
    bid: bid,
    time_to_pickup: distanceOriginToPickup*3,
    time_to_dropoff: distancePickupToDelivery*3*Math.random(),
  };
};

module.exports = {
  generateRandomVehicles,
  randomBid
};
