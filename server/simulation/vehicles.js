const {generateRandom} = require('./drone');
const turf = require('@turf/turf');

const generateRandomVehicles = (vehicleCount = 4, coords, radius = 2000) => {
  let vehicles = [];
  for (let i = 0; i < vehicleCount; i++) {
    vehicles.push(generateRandom({coords, radius}));
  }
  return vehicles;
};

const randomBid = (origin, pickup, dropoff) => {
  const originPoint = turf.point([parseFloat(origin.long), parseFloat(origin.lat)]);
  const pickupPoint = turf.point([parseFloat(pickup.long), parseFloat(pickup.lat)]);
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
  const legStartTime = leg === 'pickup' ? mission.vehicle_signed_at : mission.travelling_dropoff_at;
  let legCompletionTime = parseFloat(legStartTime) + parseFloat(mission['time_to_' + leg]);

  const destinationLong = mission[leg + '_longitude'];
  const destinationLat = mission[leg + '_latitude'];

  const timeLeftAtPreviousPosition = legCompletionTime - positionLastUpdatedAt;

  const previouslyUncoveredDistanceLong = destinationLong - previousPosition.long;
  const previouslyUncoveredDistanceLat = destinationLat - previousPosition.lat;

  const speedLong = previouslyUncoveredDistanceLong / timeLeftAtPreviousPosition;
  const speedLat = previouslyUncoveredDistanceLat / timeLeftAtPreviousPosition;

  const timeLeftAtNewPosition = legCompletionTime - Date.now();
  let long = (destinationLong - (timeLeftAtNewPosition * speedLong)).toFixed(6);
  let lat = (destinationLat - (timeLeftAtNewPosition * speedLat)).toFixed(6);

  switch(leg){
  case 'pickup':{
    long = dontMoveAtDestination(destinationLong, mission.vehicle_start_longitude, long);
    lat = dontMoveAtDestination(destinationLat, mission.vehicle_start_latitude, lat);
    break;
  }
  case 'dropoff':{
    long = dontMoveAtDestination(destinationLong, mission.pickup_longitude, long);
    lat = dontMoveAtDestination(destinationLat, mission.pickup_latitude, lat);
    break;
  }
  }

  return {long, lat};
};

const dontMoveAtDestination = (destination, startingCoordinate, nextCoordinate) => {
  if ((destination - startingCoordinate) > 0) {
    return nextCoordinate > destination ? destination : nextCoordinate;
  } else {
    return nextCoordinate < destination ? destination : nextCoordinate;
  }
};

module.exports = {
  generateRandomVehicles,
  calculateNextCoordinate,
  randomBid,
};
