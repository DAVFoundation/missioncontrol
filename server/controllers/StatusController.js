const {getVehiclesInRange, updateVehicleStatus, getVehicle, getVehicles, updateVehiclePosition, getPosition, getLatestPositionUpdate} = require('../store/vehicles');
const {getLatestMission, updateMission} = require('../store/missions');
const {createMissionUpdate} = require('../store/mission_updates');
const {hasStore} = require('../lib/environment');
const missionProgress = require('../simulation/missionProgress');
const {calculateNextCoordinate} = require('../simulation/vehicles');

const getStatus = async (req, res) => {
  const {lat, long, user_id} = req.query;
  const status = 'idle';
  const latestMission = await getLatestMission(user_id);
  let vehicles = [];
  if (hasStore()) {
    if (bids.length > 0) {
      vehicles = await getVehicles(bids.map(bid => bid.vehicle_id));
    } else {
      vehicles = await getVehiclesInRange(
        {lat: parseFloat(lat), long: parseFloat(long)},
        7000,
      );
    }
  }

  if (latestMission) {
    switch (latestMission.status) {
    case 'awaiting_signatures': {
      let elapsedTime = Date.now() - latestMission.user_signed_at;
      let elapsedSeconds = ((elapsedTime % 60000) / 1000).toFixed(0);
      if (elapsedSeconds > 6) {
        let vehicle = await getVehicle(latestMission.vehicle_id);
        await updateMission(latestMission.mission_id, {
          'vehicle_signed_at': Date.now(),
          'status': 'in_progress',
          'vehicle_start_longitude': vehicle.long,
          'vehicle_start_latitude': vehicle.lat
        });
        await updateVehicleStatus(latestMission.vehicle_id, 'travelling_pickup');
        await createMissionUpdate(latestMission.mission_id, 'travelling_pickup');
      }
      res.json({status, vehicles});
      break;
    }
    case 'in_progress': {
      const mission = latestMission;
      let vehicle = await getVehicle(latestMission.vehicle_id);
      const status = 'in_mission';
      const currentStatus = missionProgress[vehicle.status];

      if (currentStatus.beforeUpdate) await currentStatus.beforeUpdate(latestMission);
      if (currentStatus.conditionForNextUpdate(latestMission)) {
        const timestampString = currentStatus.nextMissionUpdate + '_at';
        let timestampObject = {};
        timestampObject[timestampString] = Date.now();
        await updateMission(latestMission.mission_id, timestampObject);
        await createMissionUpdate(latestMission.mission_id, currentStatus.nextMissionUpdate);
        await updateVehicleStatus(latestMission.vehicle_id, currentStatus.nextVehicleStatus);
      }

      const leg = vehicle.status.split('_')[1]; // pickup or dropoff
      const latestPositionUpdate = await getLatestPositionUpdate(vehicle);
      const positionLastUpdatedAt = latestPositionUpdate[1];
      const previousPosition = await getPosition(latestPositionUpdate[0]);
      const newCoords = await calculateNextCoordinate(vehicle, mission, leg, positionLastUpdatedAt, previousPosition);
      if (!(isNaN(newCoords.long) || isNaN(newCoords.lat))){
        await updateVehiclePosition(vehicle, newCoords.long, newCoords.lat);
      }
      // refresh vehicle object
      vehicle = await getVehicle(vehicle.id);

      vehicles = [vehicle];
      res.json({status, vehicles, mission});
      break;
    }
    default: {
      res.json({status, vehicles, mission: latestMission});
    }
    }
  } else {
    res.json({status, vehicles});
  }
};

module.exports = {getStatus};
