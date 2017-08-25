const bluebird = require('bluebird');
const redis = require('redis');
bluebird.promisifyAll(redis.RedisClient.prototype);

const client = redis.createClient({ host: 'redis', port: 6379 });

module.exports = client;
