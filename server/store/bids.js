const redis = require('./redis');

const saveBid = async ({ vehicle_id, bid, pickup, dropoff }, requestId) => {
  // get new unique id for bid
  const bidId = await redis.incrAsync('next_bid_id');

  // Save bid id in request_bids
  redis.rpushAsync(`request_bids:${requestId}`, bidId);

  // Add bid to bids
  redis.hmsetAsync(`bids:${bidId}`,
    'id', bidId,
    'vehicle_id', vehicle_id,
    'bid', bid,
    'pickup', pickup,
    'dropoff', dropoff,
  );

  return bidId;
};

const getBidsForRequest = async (requestId) => {
  // get request details
  //    note: `hgetall` is only used because we want to get the pickup coordinates so we can
  //    make up some bids. Once we don't need to make them up here we can start using `hexists`
  const request = await redis.hgetallAsync(`requests:${requestId}`);
  if (!request) return [];

  // get bids for request
  const bidIds = await redis.lrangeAsync(`request_bids:${requestId}`, 0, -1);
  const bids = await Promise.all(
    bidIds.map(bidId => redis.hgetallAsync(`bids:${bidId}`))
  );

  // If not enough bids, make some up
  if (bidIds.length < 10) {
    const { pickup_long, pickup_lat } = request;
    const vehicleIds = await redis.georadiusAsync('vehicle_positions', pickup_long, pickup_lat, 2000, 'm');
    if (vehicleIds.length > bidIds.length) {
      // Just a hacky way to get more bids from different vehicles.
      // Not guaranteed to not have duplicate bids from same vehicle
      const vehicleId = vehicleIds[bidIds.length];
      let newBid = {
        vehicle_id: vehicleId,
        bid: 0.8,
        pickup: Date.now()+(1000*60*2),
        dropoff: Date.now()+(1000*60*10),
      };
      const newBidId = await saveBid(newBid, requestId);
      newBid.id = newBidId;
      bids.push(newBid);
    }
  }

  return bids;
};

module.exports = {
  getBidsForRequest
};
