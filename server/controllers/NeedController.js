const {createNeed, getNeed, deleteNeed} = require('../store/needs');
const {deleteBidsForNeed} = require('../store/bids');
const {createMission} = require('../store/missions');
const {updateVehicleStatus} = require('../store/vehicles');
const validate = require('validate.js');
const createConstraints = require('./constraints/create');

const create = async (req, res) => {
  const {user_id} = req.query;
  const {pickup, dropoff, requested_pickup_time, size, weight} = req.body
  const needId = await createNeed({
    user_id, pickup, dropoff, requested_pickup_time, size, weight
  });
  if (needId) {
    res.json({needId});
  } else {
    res.status(500).send('Something broke!');
  }
};


const cancel = async (req, res) => {
  const {needId} = req.params;
  const need = await getNeed(needId);
  if (need) {
    await deleteNeed(need);
    await deleteBidsForNeed(need);
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
