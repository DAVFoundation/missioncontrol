const { updateVehicleStatus, getVehicle} = require('../store/vehicles');
const {getLatestMission, updateMission} = require('../store/missions');
const {createMissionUpdate} = require('../store/mission_updates');
const missionProgress = require('../simulation/missionProgress');

const getStatus = async (req, res) => {
  const {user_id} = req.query;
  const status = 'idle';
  const latestMission = await getLatestMission(user_id);

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
      res.json({status});
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
      }

      res.json({status, mission});
      break;
    }
    default: {
      res.json({status, mission: latestMission});
    }
    }
  } else {
    res.json({status});
  }
};

module.exports = {getStatus};
