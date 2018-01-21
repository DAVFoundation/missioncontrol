const { generateRandom } = require('./drone');
const turf = require('@turf/turf');

const generateRandomVehicles = (vehicleCount = 4, coords, radius = 2000) => {
  let vehicles = [];
  for (let i = 0; i < vehicleCount; i++) {
    vehicles.push(generateRandom({ coords, radius }));
  }
  return vehicles;
};

const randomBid = (origin, pickup, dropoff) => {
  const originPoint  = turf.point([parseFloat(origin.long),  parseFloat(origin.lat)]);
  const pickupPoint  = turf.point([parseFloat(pickup.long),  parseFloat(pickup.lat)]);
  const dropoffPoint = turf.point([parseFloat(dropoff.long), parseFloat(dropoff.lat)]);
  const distanceOriginToPickup = turf.distance(originPoint, pickupPoint);
  const distancePickupToDelivery = turf.distance(pickupPoint, dropoffPoint);
  const price = parseFloat(distanceOriginToPickup + distancePickupToDelivery);
  return {
    price: price,
    time_to_pickup: distanceOriginToPickup * 3 * 60000, // multiplied by 60000 to keep everything in milliseconds
    time_to_dropoff: distancePickupToDelivery * 3 * 60000 * Math.random(),
  };
};

const calculateNextCoordinate = async (vehicle, mission, leg, positionLastUpdatedAt, previousPosition) => {
  const legStartTime = leg == 'pickup' ? mission.user_signed_at : mission.travelling_dropoff_at
  const legCompletionTime = parseFloat(legStartTime) + parseFloat(mission['time_to_' + leg])
  const destinationLong = mission[leg + '_long'];
  const destinationLat = mission[leg + '_lat']

  const timeLeftAtPreviousPosition = legCompletionTime - positionLastUpdatedAt;

  const previouslyUncoveredDistanceLong = destinationLong - previousPosition.long;
  const previouslyUncoveredDistanceLat = destinationLat - previousPosition.lat;

  const speedLong = previouslyUncoveredDistanceLong / timeLeftAtPreviousPosition;
  const speedLat = previouslyUncoveredDistanceLat / timeLeftAtPreviousPosition;

  const timeLeftAtNewPosition = legCompletionTime - Date.now();
  const long = (destinationLong - (timeLeftAtNewPosition * speedLong)).toFixed(6);
  const lat = (destinationLat - (timeLeftAtNewPosition * speedLat)).toFixed(6);

  return {long, lat};
};

module.exports = {
  generateRandomVehicles,
  calculateNextCoordinate,
  randomBid,
};
