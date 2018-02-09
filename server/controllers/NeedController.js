const {createRequest, getRequest, deleteRequest} = require('../store/requests');
const {deleteBidsForRequest} = require('../store/bids');
const {createMission} = require('../store/missions');
const {updateVehicleStatus} = require('../store/vehicles');

const create = async (req, res) => {
  const {user_id} = req.query;
  const {pickup, dropoff, requested_pickup_time, size, weight} = req.body
  const requestId = await createRequest({
    user_id, pickup, dropoff, requested_pickup_time, size, weight
  });
  if (requestId) {
    res.json({requestId});
  } else {
    res.status(500).send('Something broke!');
  }
};

const cancel = async (req, res) => {
  const {needId} = req.params;
  const need = await getRequest(needId);
  if (need) {
    await deleteRequest(need);
    await deleteBidsForRequest(need);
    res.send('need cancelled');
  } else {
    res.status(500).send('Something broke!');
  }
};

const chooseBid = async (req, res) => {
  const {user_id, bid_id} = req.query;
  const mission = await createMission({
    user_id,
    bid_id,
  });
  if (mission) {
    await updateVehicleStatus(mission.vehicle_id, 'contract_received');
    res.json({mission});
  } else {
    res.status(500).send('Something broke!');
  }
};

module.exports = {create, cancel, chooseBid};
