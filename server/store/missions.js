const redis = require('./redis');
const { getBid } = require('./bids');
const { getRequest } = require('./requests');

const createMission = async ({ user_id, bid_id }) => {
  // get bid details
  const bid = await getBid(bid_id);
  const { vehicle_id, price, time_to_pickup, time_to_dropoff, request_id } = bid;

  // get request details
  const request = await getRequest(request_id);
  const { pickup_lat, pickup_long, dropoff_lat, dropoff_long, requested_pickup_time, size, weight } = request;

  // get new unique id for mission
  const missionId = await redis.incrAsync('next_mission_id');
  const user_signed_at = Date.now();

  // create a new mission entry in Redis
  redis.hmsetAsync(`missions:${missionId}`,
    'user_id', user_id,
    'vehicle_id', vehicle_id,
    'price', price,
    'time_to_pickup', time_to_pickup,
    'time_to_dropoff', time_to_dropoff,
    'request_id', request_id,
    'pickup_lat', pickup_lat,
    'pickup_long', pickup_long,
    'dropoff_lat', dropoff_lat,
    'dropoff_long', dropoff_long,
    'requested_pickup_time', requested_pickup_time,
    'size', size,
    'weight', weight,
    'user_signed_at', user_signed_at,
  );
  return {
    mission_id: missionId,
    vehicle_id,
    price,
    time_to_pickup,
    time_to_dropoff,
    pickup_lat,
    pickup_long,
    dropoff_lat,
    dropoff_long,
    requested_pickup_time,
    size,
    weight,
    user_signed_at,
  };
};

module.exports = {
  createMission
};
