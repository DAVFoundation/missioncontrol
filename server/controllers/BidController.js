const { getBidsForNeed } = require('../store/bids');
const { createMission } = require('../store/missions');
const { updateVehicleStatus } = require('../store/vehicles');
const { addBidToCaptain, getBids } = require('../store/captains');
// const droneApi = require('../coex/drone');

const fetch = async (req, res) => {
  try {
    const { needId } = req.params;
    const bids = (!needId) ? [] : await getBidsForNeed(needId);
    res.status(200).json(bids);
  }
  catch (error) {
    res.status(500).send('Something broke.');
    console.error(error);
  }
};

const chooseBid = async (req, res) => {
  const { user_id } = req.query;
  const { bidId } = req.params;
  const mission = await createMission({
    user_id,
    bidId,
  });
  if (mission) {
    await addBidToCaptain(user_id, bidId);
    // droneApi.beginMission(mission.vehicle_id, mission.mission_id);
    await updateVehicleStatus(mission.vehicle_id, 'contract_received');
    res.json({ mission });
  } else {
    res.status(500).send('Something broke!');
  }
};

const fetchChosen = async (req, res) => {
  const { davId } = req.params;
  const bids = await getBids(davId);
  res.status(200).send(bids);
};

module.exports = { fetch, chooseBid, fetchChosen };
