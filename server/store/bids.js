const redis = require('./redis');
const { randomBid } = require('../simulation/vehicles');
const { getVehicle } = require('../store/vehicles');
const { getRequest } = require('../store/requests');

const saveBid = async ({ vehicle_id, bid, time_to_pickup, time_to_dropoff }, requestId, userId) => {
  // get new unique id for bid
  const bidId = await redis.incrAsync('next_bid_id');

  // Save bid id in request_bids
  redis.rpushAsync(`request_bids:${requestId}`, bidId);

  // Add bid to bids
  redis.hmsetAsync(`bids:${bidId}`,
    'id', bidId,
    'vehicle_id', vehicle_id,
    'user_id', userId,
    'price', bid,
    'time_to_pickup', time_to_pickup,
    'time_to_dropoff', time_to_dropoff,
    'request_id', requestId,
  );

  return bidId;
};

const getBid = async (bidId) => {
  return await redis.hgetallAsync(`bids:${bidId}`);
};

const getBidsForRequest = async (requestId) => {
  // get request details
  const request = await getRequest(requestId);
  if (!request) return [];

  const userId = request.user_id;

  // get bids for request
  const bidIds = await redis.lrangeAsync(`request_bids:${requestId}`, 0, -1);
  const bids = await Promise.all(
    bidIds.map(bidId => redis.hgetallAsync(`bids:${bidId}`))
  );

  // If not enough bids, make some up
  if (bidIds.length < 10) {
    const { pickup_long, pickup_lat, dropoff_lat, dropoff_long } = request;
    const pickup =  {lat: pickup_lat,  long: pickup_long};
    const dropoff = {lat: dropoff_lat, long: dropoff_long};
    const vehicleIds = await redis.georadiusAsync('vehicle_positions', pickup_long, pickup_lat, 2000, 'm');
    if (vehicleIds.length > bidIds.length) {
      // Just a hacky way to get more bids from different vehicles.
      // Not guaranteed to not have duplicate bids from same vehicle
      const vehicleId = vehicleIds[bidIds.length];
      const vehicle = await getVehicle(vehicleId);
      const origin = {lat: vehicle.lat, long: vehicle.long};
      let newBid = randomBid(origin, pickup, dropoff);
      newBid.vehicle_id = vehicleId;
      const newBidId = await saveBid(newBid, requestId, userId);
      newBid.id = newBidId;
      bids.push(newBid);
    }
  }

  return bids;
};

module.exports = {
  getBidsForRequest,
  getBid,
};
