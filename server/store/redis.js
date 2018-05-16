const host = process.env.REDIS_HOST || 'redis';
const port = process.env.REDIS_PORT || 6379;
const bluebird = require('bluebird');
const redis = require('redis');
bluebird.promisifyAll(redis.RedisClient.prototype);

const client = redis.createClient({
  host: host,
  port: port
});

client.encode = function (obj) {
  return Buffer.from(JSON.stringify(obj)).toString('base64');
};

client.decode = function (str) {
  if(!str)
  {
    return null;
  }
  return JSON.parse(Buffer.from(str, 'base64').toString('ascii'));
};

module.exports = client;
