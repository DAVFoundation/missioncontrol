const redis = require('./redis');
const config = require('../config');
const { getNeed } = require('./needs');
const { createMissionUpdate } = require('./mission_updates');

const getMission = async missionId => {
  let mission = await getMissionByBidId(missionId);
  let updates = await getMissionUpdates(missionId);
  return {
    ...mission,
    ...mission.need,
    ...mission.bid,
    ...updates
  };
};

const getMissionUpdates = async missionId => {
  let updatesArray = await redis.zrevrangeAsync(`mission_updates:${missionId}`, 0, -1, 'withscores');
  let updates = {};
  for(let i = 0; i < updatesArray.length; i += 2) {
    updates[updatesArray[i] + '_at'] = updatesArray[i + 1];
  }
  return updates;
};

const getMissionByBidId = async bid_id => {
  return redis.decode(await redis.getAsync(`missions_${bid_id}`));
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
  return await saveMission(id, {...mission, ...params});
};

const saveMission = async (bidId, mission) => {
  await redis.setAsync(`missions_${bidId}`,redis.encode(mission),'EX',mission.ttl||config('bids_ttl'));
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

  saveMission(bidId, {
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
