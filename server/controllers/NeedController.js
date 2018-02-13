const {createNeed, getNeed, deleteNeed} = require('../store/needs');
const {deleteBidsForNeed} = require('../store/bids');
const {createMission} = require('../store/missions');
const {updateVehicleStatus} = require('../store/vehicles');
const createConstraints = require('./constraints/need/create');

// using downloaded validate.js file because latest version does not have type checking and docker fails with git source in package.json
const validate = require('../lib/validate');

const create = async (req, res) => {
  const params = req.body;
  const validationErrors = validate(params, createConstraints);
  if (validationErrors) {
    res.status(422).json(validationErrors);
  } else {
    const allowedParamsKeys = Object.keys(createConstraints);
    Object.keys(params).forEach(key => {if (!allowedParamsKeys.includes(key)) delete params[key];});
    params.user_id = req.query.user_id;
    const needId = await createNeed(params);
    if (needId) {
      res.json({needId});
    } else {
      res.status(500).send('Something broke!');
    }
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
