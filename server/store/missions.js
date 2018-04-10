const redis = require('./redis');
const config = require('../config');
const { getNeed } = require('./needs');
const { createMissionUpdate } = require('./mission_updates');
const Aerospike = require('aerospike');
const {aerospikeConfig, namespace} = require('../config/aerospike');
const aerospike = Aerospike.client(aerospikeConfig());

const getMission = async missionId => {
  const mission = await redis.hgetallAsync(`missions:${missionId}`);
  mission.mission_id = missionId;
  return mission;
};

const getMissionByBidId = async bid_id => {
  try {
    let policy = new Aerospike.WritePolicy({
      exists: Aerospike.policy.exists.CREATE_OR_REPLACE
    });
    await aerospike.connect();
    let key = new Aerospike.Key(namespace, 'missions', bid_id);
    let res = await aerospike.get(key, policy);
    return res.bins.missions;
  }
  catch (error) {
    if (error.message.includes('Record does not exist in database')) {
      return [];
    }
    throw error;
  }
};

const getLatestMission = async userId => {
  const missions = await redis.zrevrangeAsync(`user_missions:${userId}`, 0, -1);
  let mission = null;
  if (missions.length > 0) {
    mission = await getMission(missions[0]);
    if (typeof mission === 'object') {
      return mission;
    }
  }
};

const updateMission = async (id, params) => {
  const key_value_array = [].concat(...Object.entries(params));
  return await redis.hmsetAsync(`missions:${id}`, ...key_value_array);
};

const saveMissionToAerospike = async (bidId, mission) => {
  let policy = new Aerospike.WritePolicy({
    exists: Aerospike.policy.exists.CREATE_OR_REPLACE
  });
  await aerospike.connect();
  let key = new Aerospike.Key(namespace, 'missions', bidId);
  await aerospike.put(key, mission, {ttl: config('bids_ttl')}, policy);
};

const createMission = async ({ user_id, bidId }) => {
  const { getBid } = require('./bids');
  // get bid details
  const bid = await getBid(bidId);
  const { vehicle_id, price, time_to_pickup, time_to_dropoff, need_id } = bid;

  // get neeed details
  const need = await getNeed(need_id);
  const { pickup_latitude, pickup_longitude, pickup_address, dropoff_latitude, dropoff_longitude, pickup_at, cargo_type, weight } = need;

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
    'need_id', need_id,
    'pickup_latitude', pickup_latitude,
    'pickup_longitude', pickup_longitude,
    'pickup_address', pickup_address,
    'dropoff_latitude', dropoff_latitude,
    'dropoff_longitude', dropoff_longitude,
    'pickup_at', pickup_at,
    'cargo_type', cargo_type,
    'weight', weight,
    'status', 'awaiting_signatures',
    'user_signed_at', user_signed_at,
  );
  let mission = {
    mission_id: missionId,
    user_id,
    vehicle_id,
    price,
    time_to_pickup,
    time_to_dropoff,
    need_id,
    pickup_latitude,
    pickup_longitude,
    pickup_address,
    dropoff_latitude,
    dropoff_longitude,
    pickup_at,
    cargo_type,
    weight,
    status: 'awaiting_signatures',
    user_signed_at,
  };
  saveMissionToAerospike(bidId, {
    mission_id: missionId,
    bid_id: bidId,
    user_id,
    vehicle_id,
    price,
    time_to_pickup,
    time_to_dropoff,
    need_id,
    pick_latitude: pickup_latitude,
    pick_longitude: pickup_longitude,
    pickup_address,
    drop_latitude: dropoff_latitude,
    drop_longitude: dropoff_longitude,
    pickup_at,
    cargo_type,
    weight,
    status: 'awaiting_signatures',
    user_signed_at,
  });
  return mission;
};

module.exports = {
  createMission,
  getMission,
  getMissionByBidId,
  getLatestMission,
  updateMission,
};
