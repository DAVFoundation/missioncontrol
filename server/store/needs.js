const redis = require('./redis');
const config = require('../config');
const { getVehiclesInRange } = require('./vehicles');

const getNeed = async needId => {
  // Set TTL for need
  setNeedTTL(needId);
  return await redis.hgetallAsync(`needs:${needId}`);
};

const createNeed = async needDetails => {
  // get new unique id for need
  const needId = await redis.incrAsync('next_need_id');
  const key_value_array = [].concat(...Object.entries(needDetails));
  redis.hmsetAsync(`needs:${needId}`, ...key_value_array);

  // See if there are any vehicles around the pickup position, if not a few vehicles will be generated there
  getVehiclesInRange({ lat: parseFloat(needDetails.pickup_latitude), long: parseFloat(needDetails.pickup_longitude) }, 7000);

  // Set TTL for need
  setNeedTTL(needId);
  return needId;
};

const deleteNeed = async needId => {
  return await redis.del(`needs:${needId}`);
};

const setNeedTTL = needId => redis.expire(`needs:${needId}`, config('needs_ttl'));

module.exports = {
  createNeed,
  getNeed,
  deleteNeed,
};
