const redis = require('./redis');
const config = require('../config');
const { randomBid } = require('../simulation/vehicles');
const { getVehicle, generateSoloVehicleForBid } = require('../store/vehicles');
const { getNeed } = require('./needs');

const saveBid = async ({ vehicle_id, price, time_to_pickup, time_to_dropoff }, needId, userId) => {
  // get new unique id for bid
  const bidId = await redis.incrAsync('next_bid_id');

  // Save bid id in need_bids
  redis.rpushAsync(`need_bids:${needId}`, bidId);

  // Add bid to bids
  redis.hmsetAsync(`bids:${bidId}`,
    'id', bidId,
    'vehicle_id', vehicle_id,
    'user_id', userId,
    'price', price,
    'time_to_pickup', time_to_pickup,
    'time_to_dropoff', time_to_dropoff,
    'need_id', needId,
  );

  // Set TTL for bid
  redis.expire(`bids:${bidId}`, config('bids_ttl'));
  return bidId;
};

const getBid = async bidId => {
  // Set TTL for bid
  redis.expire(`bids:${bidId}`, config('bids_ttl'));
  return await redis.hgetallAsync(`bids:${bidId}`);
};

const getBidsForNeed = async needId => {
  // get request details
  const need = await getNeed(needId);
  if (!need) return [];

  const userId = need.user_id;

  // get bids for need
  const bidIds = await redis.lrangeAsync(`need_bids:${needId}`, 0, -1);
  const bids = await Promise.all(
    bidIds.map(bidId => {
      redis.expire(`bids:${bidId}`, config('bids_ttl'));
      return redis.hgetallAsync(`bids:${bidId}`);
    }),
  );

  // If not enough bids, make some up
  if (bidIds.length < 10) {
    const { pickup_longitude, pickup_latitude, dropoff_latitude, dropoff_longitude } = need;
    const pickup = { lat: pickup_latitude, long: pickup_longitude };
    const dropoff = { lat: dropoff_latitude, long: dropoff_longitude };
    const vehicleIds = await redis.georadiusAsync(
      'vehicle_positions',
      pickup_longitude,
      pickup_latitude,
      2000,
      'm',
    );
    if (vehicleIds.length > bidIds.length) {
      // Just a hacky way to get more bids from different vehicles.
      // Not guaranteed to not have duplicate bids from same vehicle
      const vehicleId = vehicleIds[bidIds.length];
      let vehicle = await getVehicle(vehicleId);
      if (vehicle.status !== 'available') {
        // if the vehicle is not available then we will generate
        // some new vehicle to simulate the entry of new providers (default radius)
        vehicle = generateSoloVehicleForBid(pickup);
      }
      let newBid = await generateBidFromVehicle(vehicle, pickup, dropoff, needId, userId);
      bids.push(newBid);
    }
  }
  return bids;
};

const generateBidFromVehicle = async (vehicle, pickup, dropoff, needId, userId) => {
  const origin = { lat: vehicle.lat, long: vehicle.long };
  let newBid = randomBid(origin, pickup, dropoff);
  newBid.vehicle_id = vehicle.id;
  const newBidId = await saveBid(newBid, needId, userId);
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
  deleteBidsForNeed,
};
