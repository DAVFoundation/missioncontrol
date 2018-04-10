const { updateVehiclePosition, getVehicle, addNewVehicle } = require('../store/vehicles');
const validate = require('../lib/validate');
const vehicleCreateConstraints = require('./constraints/vehicle/create');
const vehicleUpdateConstraints = require('./constraints/vehicle/update');


const fetch = async (req, res) => {
  const { vehicleId } = req.params;
  let vehicle = await getVehicle(vehicleId);
  if (vehicle) {
    res.json(vehicle);
  } else {
    res.status(404).send('Vehicle not found!');
  }
};

const create = async (req, res) => {
  const params = req.body;
  const validationErrors = validate(params, vehicleCreateConstraints);
  if (validationErrors) {
    res.status(422).json(validationErrors);
  } else {
    let vehicle = await addNewVehicle(params);
    // await updateVehiclePosition(mission.vehicle, params.longitude, params.latitude);
    vehicle = await getVehicle(vehicle.vehicle_id); //refresh mission
    if (vehicle) {
      res.json({ vehicle });
    } else {
      res.status(500).send('Something broke!');
    }
  }
};

const update = async (req, res) => {
  const { vehicleId } = req.params;
  const params = req.body;
  const validationErrors = validate(params, vehicleUpdateConstraints);
  if (validationErrors) {
    res.status(422).json(validationErrors);
  } else {
    const vehicle = await getVehicle(vehicleId);
    if (vehicle) {
      const { /* status, */ coords } = params;
      await updateVehiclePosition(vehicle, coords.long, coords.long.lat);
      res.status(200).json(vehicle);
    } else {
      res.status(404).send('Vehicle not found!');
    }
  }
};

module.exports = { update, fetch, create };
