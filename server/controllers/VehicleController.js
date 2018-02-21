const {hasStore} = require('../lib/environment');
const { getLatestMission } = require('../store/missions');
const { getBidsForNeed } = require('../store/bids');
const { updateVehiclePosition, getVehicle, getVehicles, getVehiclesInRange, updateVehicleStatus, getLatestPositionUpdate, getPosition } = require('../store/vehicles');
const {calculateNextCoordinate} = require('../simulation/vehicles');
const missionProgress = require('../simulation/missionProgress');

const fetch = async (req, res) => {
  const { lat, long, user_id, needId } = req.query;
  let vehicles = [];

  if (hasStore()) {
    const bids = !needId ? [] : await getBidsForNeed(needId);
    if (bids.length > 0) {
      vehicles = await getVehicles(bids.map(bid => bid.vehicle_id));
    } else {
      vehicles = await getVehiclesInRange(
        {lat: parseFloat(lat), long: parseFloat(long)},
        7000,
      );
    }
  }

  const latestMission = await getLatestMission(user_id);
  if (latestMission && latestMission.status === 'in_progress'){
    let vehicle = await getVehicle(latestMission.vehicle_id);

    const currentStatus = missionProgress[vehicle.status];
    if (currentStatus.conditionForNextUpdate(latestMission)) {
      await updateVehicleStatus(latestMission.vehicle_id, currentStatus.nextVehicleStatus);
    }

    const leg = vehicle.status.split('_')[1]; // pickup or dropoff
    const latestPositionUpdate = await getLatestPositionUpdate(vehicle);
    const positionLastUpdatedAt = latestPositionUpdate[1];
    const previousPosition = await getPosition(latestPositionUpdate[0]);
    const newCoords = await calculateNextCoordinate(vehicle, latestMission, leg, positionLastUpdatedAt, previousPosition);
    if (!(isNaN(newCoords.long) || isNaN(newCoords.lat))){
      await updateVehiclePosition(vehicle, newCoords.long, newCoords.lat);
    }
    vehicle =  await getVehicle(vehicle.id); // refresh vehicle object
    vehicles = [vehicle];
  }

  res.status(200).json(vehicles);
};

module.exports = {fetch};