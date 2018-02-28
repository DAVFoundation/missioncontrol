const host = process.env.REDIS_HOST || 'redis';
const port = process.env.REDIS_PORT || 6379;
const bluebird = require('bluebird');
const redis = require('redis');
bluebird.promisifyAll(redis.RedisClient.prototype);

const client = redis.createClient({ host: host, port: port });

module.exports = client;

