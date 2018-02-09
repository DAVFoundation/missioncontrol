const { createRequest, getRequest, deleteRequest } = require('../store/requests');
const { deleteBidsForRequest } = require('../store/bids');
const { createMission } = require('../store/missions');
const { updateVehicleStatus } = require('../store/vehicles');

const newRequest = async (req, res) => {
  const { user_id, pickup, dropoff, requested_pickup_time, size, weight } = req.query;
  const requestId = await createRequest({
    user_id, pickup, dropoff, requested_pickup_time, size, weight
  });
  if (requestId) {
    res.json({ requestId });
  } else {
    res.status(500).send('Something broke!');
  }
};

const cancelRequest = async (req, res) => {
  const { requestId } = req.query;
  const request = await getRequest(requestId);
  if (request) {
    await deleteRequest(requestId);
    await deleteBidsForRequest(requestId);
    res.send('request cancelled');
  } else {
    res.status(500).send('Something broke!');
  }
};

const chooseBid = async (req, res) => {
  const { user_id, bid_id } = req.query;
  const mission = await createMission({
    user_id,
    bid_id,
  });
  if (mission) {
    await updateVehicleStatus(mission.vehicle_id, 'contract_received');
    res.json({ mission });
  } else {
    res.status(500).send('Something broke!');
  }
};

module.exports = { newRequest, cancelRequest, chooseBid };
