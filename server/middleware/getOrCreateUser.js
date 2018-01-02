const { getOrCreateUser } = require('../store/users');

module.exports = async (req, res, next) => {
  const { user_id } = req.query;
  let user = await getOrCreateUser(user_id);
  req.user = user;
  next();
};
