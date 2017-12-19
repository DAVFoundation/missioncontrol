const redis = require('./redis');

const createMissionUpdate = async(missionId, stage) => {
  await redis.zaddAsync(`mission_updates:${missionId}`, Date.now(), stage);
};

module.exports = {
  createMissionUpdate
};