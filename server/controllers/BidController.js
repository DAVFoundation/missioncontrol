const {getBidsForNeed} = require('../store/bids');
const {hasStore} = require('../lib/environment');
const {createMission} = require('../store/missions');
const {updateVehicleStatus} = require('../store/vehicles');

const fetch = async (req, res) => {
  const {needId} = req.params;
  const bids = (!hasStore() || !needId) ? [] : await getBidsForNeed(needId);
  res.status(200).json(bids);
}

const chooseBid = async (req, res) => {
  const {user_id } = req.query;
  const {bidId} = req.params;
  const mission = await createMission({
    user_id,
    bidId,
  });
  if (mission) {
    await updateVehicleStatus(mission.vehicle_id, 'contract_received');
    res.json({mission});
  } else {
    res.status(500).send('Something broke!');
  }
};

module.exports = {fetch, chooseBid}
