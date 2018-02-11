const redis = require('./redis');
const config = require('../config');
const { randomBid } = require('../simulation/vehicles');
const { getVehicle } = require('../store/vehicles');
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
    const { pickup_long, pickup_lat, dropoff_lat, dropoff_long } = need;
    const pickup = { lat: pickup_lat, long: pickup_long };
    const dropoff = { lat: dropoff_lat, long: dropoff_long };
    const vehicleIds = await redis.georadiusAsync(
      'vehicle_positions',
      pickup_long,
      pickup_lat,
      2000,
      'm',
    );
    if (vehicleIds.length > bidIds.length) {
      // Just a hacky way to get more bids from different vehicles.
      // Not guaranteed to not have duplicate bids from same vehicle
      const vehicleId = vehicleIds[bidIds.length];
      const vehicle = await getVehicle(vehicleId);
      const origin = { lat: vehicle.lat, long: vehicle.long };
      let newBid = randomBid(origin, pickup, dropoff);
      newBid.vehicle_id = vehicleId;
      const newBidId = await saveBid(newBid, needId, userId);
      newBid.id = newBidId;
      bids.push(newBid);
    }
  }

  return bids;
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
