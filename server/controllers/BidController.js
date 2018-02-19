const {getBidsForNeed} = require('../store/bids');
const {hasStore} = require('../lib/environment');

const fetch = async (req, res) => {
  const {needId} = req.params;
  const bids = (!hasStore() || !needId) ? [] : await getBidsForNeed(needId);
  res.status(200).json(bids);
}

module.exports = {fetch};
