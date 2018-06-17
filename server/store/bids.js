const redis = require('./redis');
const config = require('../config');
// const { getVehicle } = require('../store/vehicles');
const { getNeed } = require('./needs');

const saveBid = async ({ id, captain_id, time_to_pickup, time_to_dropoff, ttl, price, price_type, price_description, expires_at, distance, ETA, chosen=false}, needId) => {
  // Save bid id in need_bids
  redis.rpushAsync(`need_bids:${needId}`, id);

  // Add bid to bids
  redis.hmsetAsync(`bids:${id}`,
    'id', id,
    'captain_id', captain_id,
    'price', price,
    'price_type', price_type,
    'price_description', price_description,
    'expires_at', expires_at,
    'distance', distance,
    'time_to_pickup', time_to_pickup,
    'time_to_dropoff', time_to_dropoff,
    'need_id', needId,
    'chosen', chosen,
    'ETA', ETA,
    'ttl', ttl
  );

  // Set TTL for bid
  setBidTTL(id);
  return id;
};

const getBid = async bidId => {
  // Set TTL for bid
  setBidTTL(bidId);
  return await redis.hgetallAsync(`bids:${bidId}`);
};

const getBidsForNeed = async needId => {
  // get request details
  const need = await getNeed(needId);
  if (!need) return [];

  // const userId = need.user_id;

  // get bids for need
  const bidIds = await redis.lrangeAsync(`need_bids:${needId}`, 0, -1);
  const bids = await Promise.all(
    bidIds.map(bidId => {
      setBidTTL(bidId);
      return redis.hgetallAsync(`bids:${bidId}`);
    }),
  );

  // If not enough bids, make some up
  // if (bidIds.length < 10) {
  //   const { pickup_longitude, pickup_latitude, dropoff_latitude, dropoff_longitude } = need;
  //   const pickup = { lat: pickup_latitude, long: pickup_longitude };
  //   const dropoff = { lat: dropoff_latitude, long: dropoff_longitude };
  //   const vehicleIds = await redis.georadiusAsync(
  //     'vehicle_positions',
  //     pickup_longitude,
  //     pickup_latitude,
  //     2000,
  //     'm',
  //   );
  //   if (vehicleIds.length > bidIds.length) {
  //     // Just a hacky way to get more bids from different vehicles.
  //     // Not guaranteed to not have duplicate bids from same vehicle
  //     const vehicleId = vehicleIds[bidIds.length];
  //     let vehicle = await getVehicle(vehicleId);
  //     /*       if (vehicle.status !== 'available') {
  //             // if the vehicle is not available then we will generate
  //             // some new vehicle to simulate the entry of new providers (default radius)
  //             const pickupNumber = {lat: parseFloat(pickup.lat), long: parseFloat(pickup.long)};
  //             vehicle = generateSoloVehicleForBid(pickupNumber);
  //           } */
  //     let newBid = await generateBidFromVehicle(vehicle, pickup, dropoff, needId, userId);
  //     bids.push(newBid);
  //   }
  // }
  return bids;
};

// const coexDrone = require('../coex/drone');

const addNewBid = async (newBid, needId) => {
  // const origin = { lat: vehicle.coords.lat, long: vehicle.coords.long };
  // let newBid = coexDrone.getBid(vehicle.id,origin, pickup, dropoff);
  // newBid.vehicle_id = vehicle.id;
  const newBidId = await saveBid(newBid, needId);
  newBid.id = newBidId;
  return newBid;
};

const deleteBidsForNeed = async needId => {
  const bidIds = await redis.lrangeAsync(`need_bids:${needId}`, 0, -1);
  await Promise.all(
    bidIds.map(bidId => redis.del(`bids:${bidId}`))
  );
  return await redis.del(`need_bids:${needId}`);
};

module.exports = {
  getBidsForNeed,
  getBid,
  saveBid,
  addNewBid,
  deleteBidsForNeed,
};

const setBidTTL = bidId => redis.expire(`bids:${bidId}`, config('bids_ttl'));
