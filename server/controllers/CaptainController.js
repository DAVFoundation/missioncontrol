const createConstraints = require('./constraints/captain/create');
const needTypeConstraints = require('./constraints/captain/needType');
const captainUpdateConstraints = require('./constraints/captain/update');
const validate = require('../lib/validate');
const { addNewCaptain, addNeedTypeForCaptain, getCaptain, updateCaptainPosition } = require('../store/captains');

const fetch = async (req, res) => {
  const { captainId } = req.params;
  let captain = await getCaptain(captainId);
  if (captain) {
    res.json(captain);
  } else {
    res.status(404).send('Vehicle not found!');
  }
};

const create = async (req, res) => {
  let params = req.body;
  const validationErrors = validate(params, createConstraints);
  if (validationErrors) {
    res.status(422).json(validationErrors);
  } else {
    await addNewCaptain(params);
    // await updateVehiclePosition(mission.vehicle, params.longitude, params.latitude);
    let captain = await getCaptain(params.id); //refresh mission
    if (captain) {
      res.json({ captain });
    } else {
      res.status(500).send('Something broke!');
    }
  }
};

const update = async (req, res) => {
  const { captainId } = req.params;
  const params = req.body;
  const validationErrors = validate(params, captainUpdateConstraints);
  if (validationErrors) {
    res.status(422).json(validationErrors);
  } else {
    const captain = await getCaptain(captainId);
    if (captain) {
      const { /* status, */ coords } = params;
      await updateCaptainPosition(captain, coords.long, coords.long.lat);
      res.status(200).json(captain);
    } else {
      res.status(404).send('Vehicle not found!');
    }
  }
};

const registerNeedTypeForCaptain = async (req, res) => {
  let params = req.body;
  const { davId } = req.params;
  params.dav_id = davId;
  const validationErrors = validate(params, needTypeConstraints);
  if (validationErrors) {
    res.status(422).json(validationErrors);
  } else {
    try {
      const davId = await addNeedTypeForCaptain(params);
      res.json({ dav_id: davId });
    }
    catch (error) {
      res.status(500).send(JSON.stringify(error));
    }
  }
};

module.exports = { create, fetch, registerNeedTypeForCaptain, update };