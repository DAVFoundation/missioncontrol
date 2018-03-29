const { getVehiclesInRange, getVehicles } = require('../store/vehicles');
const { getBidsForNeed } = require('../store/bids');
const { getLatestMission } = require('../store/missions');

const getStatus = async (req, res) => {
  const { lat, long, needId, user_id } = req.query;
  const latestMission = await getLatestMission(user_id);
  const bids = (!needId) ? [] : await getBidsForNeed(needId);
  let vehicles = [];
  if (bids.length > 0) {
    vehicles = await getVehicles(bids.map(bid => bid.vehicle_id));
  } else {
    vehicles = await getVehiclesInRange(
      { lat: parseFloat(lat), long: parseFloat(long) },
      7000,
    );
  }

  if (latestMission) {
    res.json({ status: latestMission.status, vehicles, mission: latestMission });
  } else {
    res.json({ status: 'idle', vehicles });
  }
};

module.exports = { getStatus };
