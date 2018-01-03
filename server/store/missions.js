const redis = require('./redis');
const { getBid } = require('./bids');
const { getRequest } = require('./requests');
const { createMissionUpdate } = require('./mission_updates');

const getMission = async missionId => {
  return await redis.hgetallAsync(`missions:${missionId}`);
};

const getLatestMissionId = async userId => {
  // use zrevrange to reverse sorted set from highest to lowest
  // reversed values will put most recent timestamp at the top
  const missions = await redis.zrevrangeAsync(`user_missions:${userId}`, 0, -1);
  return missions[0];
};

const updateMission = async (id, params) => {
  const key_value_array = [].concat(...Object.entries(params));
  return await redis.hmsetAsync(`missions:${id}`, ...key_value_array);
};

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

  // Save mission in user missions history
  redis.zaddAsync(`user_missions:${user_id}`, user_signed_at, missionId);

  createMissionUpdate(missionId, 'contract_created');
  createMissionUpdate(missionId, 'user_signed');

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
    'status', 'awaiting_signatures',
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
  createMission,
  getMission,
  getLatestMissionId,
  updateMission,
};
