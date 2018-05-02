const redis = require('./redis');
const config = require('../config');
const { getNeed } = require('./needs');
const { createMissionUpdate } = require('./mission_updates');
const Aerospike = require('aerospike');
const {aerospikeConfig, namespace} = require('../config/aerospike');
const aerospike = Aerospike.client(aerospikeConfig());

const getMission = async missionId => {
  let mission = await getMissionByBidId(missionId);
  return {
    ...mission,
    ...mission.need,
    ...mission.bid
  };
};

const getMissionByBidId = async bid_id => {
  try {
    let policy = new Aerospike.WritePolicy({
      exists: Aerospike.policy.exists.CREATE_OR_REPLACE
    });
    await aerospike.connect();
    let key = new Aerospike.Key(namespace, 'missions', bid_id);
    let res = await aerospike.get(key, policy);
    return res.bins;
  }
  catch (error) {
    if (error.message.includes('Record does not exist in database')) {
      return {};
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
  let mission = await getMissionByBidId(id);
  return await saveMissionToAerospike(id, {...mission, ...params});
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

  // get neeed details
  const need = await getNeed(bid.need_id);
  
  // get new unique id for mission
  const missionId = bidId;
  const user_signed_at = Date.now();

  // Save mission in user missions history
  redis.zaddAsync(`user_missions:${user_id}`, user_signed_at, missionId);

  createMissionUpdate(missionId, 'contract_created');
  createMissionUpdate(missionId, 'user_signed');

  saveMissionToAerospike(bidId, {
    mission_id: bidId,
    bid_id: bidId,
    user_id,
    status: 'awaiting_signatures',
    need,
    bid
  });
  return {
    mission_id: bidId,
    bid_id: bidId,
    user_id,
    user_signed_at,
    status: 'awaiting_signatures',
    ...need,
    ...bid
  };
};

module.exports = {
  createMission,
  getMission,
  getMissionByBidId,
  getLatestMission,
  updateMission,
};
