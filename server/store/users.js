const redis = require('./redis');

const getUser = async userId => {
  return await redis.hgetallAsync(`users:${userId}`);
};

const createUser = async userId => {
  if (!userId) userId = await redis.incrAsync('next_user_id');
  redis.hmsetAsync(`users:${userId}`, 'user_id', userId);
  return userId;
};

const getOrCreateUser = async userId => {
  let user = await getUser(userId);
  if (!user) {
    await createUser(userId);
    user = await getUser(userId);
  }
  return user;
};

module.exports = {
  getOrCreateUser,
};
