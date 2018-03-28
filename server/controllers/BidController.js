const { getBidsForNeed } = require('../store/bids');
const { createMission } = require('../store/missions');
const { updateVehicleStatus } = require('../store/vehicles');

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
    await updateVehicleStatus(mission.vehicle_id, 'contract_received');
    res.json({ mission });
  } else {
    res.status(500).send('Something broke!');
  }
};

module.exports = { fetch, chooseBid };
