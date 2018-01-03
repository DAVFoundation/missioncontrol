const redis = require('./redis');
const config = require('../config');

const getRequest = async requestId => {
  // Set TTL for request
  redis.expire(`requests:${requestId}`, config('requests_ttl'));
  return await redis.hgetallAsync(`requests:${requestId}`);
};

const createRequest = async requestDetails => {
  // get new unique id for request
  const requestId = await redis.incrAsync('next_request_id');

  // create a new request entry in Redis
  const {user_id, pickup, dropoff, requested_pickup_time, size, weight} = requestDetails;
  const [pickup_lat, pickup_long] = pickup.split(',');
  const [dropoff_lat, dropoff_long] = dropoff.split(',');
  redis.hmsetAsync(`requests:${requestId}`,
    'user_id', user_id,
    'pickup_lat', pickup_lat,
    'pickup_long', pickup_long,
    'dropoff_lat', dropoff_lat,
    'dropoff_long', dropoff_long,
    'requested_pickup_time', requested_pickup_time,
    'size', size,
    'weight', weight,
  );

  // Set TTL for request
  redis.expire(`requests:${requestId}`, config('requests_ttl'));
  return requestId;
};

const deleteRequest = async requestId => {
  return await redis.del(`requests:${requestId}`);
};

module.exports = {
  createRequest,
  getRequest,
  deleteRequest,
};
