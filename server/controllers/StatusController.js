const { getVehiclesInRange, updateVehicleStatus, getVehicle, getVehicles } = require('../store/vehicles');
const { getBidsForRequest } = require('../store/bids');
const { getLatestMission, updateMission } = require('../store/missions');
const { createMissionUpdate } = require('../store/mission_updates');
const { hasStore } = require('../lib/environment');
const missionProgress = require('../simulation/missionProgress');

const getStatus = async (req, res) => {
  const { lat, long, requestId, user_id } = req.query;
  const status = 'idle';
  const latestMission = await getLatestMission(user_id);
  const bids = (!hasStore() || !requestId) ? [] : await getBidsForRequest(requestId);
  let vehicles = [];
  if (hasStore()) {
    if (bids.length > 0) {
      vehicles = await getVehicles(bids.map(bid => bid.vehicle_id));
    } else {
      vehicles = await getVehiclesInRange(
        { lat: parseFloat(lat), long: parseFloat(long) },
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
        await updateMission(latestMission.mission_id, {'vehicle_signed_at': Date.now(), 'status': 'in_progress'});
        await updateVehicleStatus(latestMission.vehicle_id, 'travelling_pickup');
        await createMissionUpdate(latestMission.mission_id, 'travelling_pickup');
      }
      res.json({status, vehicles, bids});
      break;
    }
    case 'in_progress': {
      const mission = latestMission;
      const vehicle = await getVehicle(latestMission.vehicle_id);
      const status = 'in_mission';
      const currentStatus = missionProgress[vehicle.status];
      if (currentStatus.conditionForNextStatus(latestMission)){
        const timestampString = currentStatus.nextMissionStatus + '_at';
        let timestampObject = {};
        timestampObject[timestampString] = Date.now();
        await updateMission(latestMission.mission_id, timestampObject);
        await createMissionUpdate(latestMission.mission_id, currentStatus.nextMissionStatus);
        await updateVehicleStatus(latestMission.vehicle_id, currentStatus.nextVehicleStatus);
      }
      vehicles = [vehicle];
      res.json({status, vehicles, bids, mission});
      break;
    }
    }
  } else {
    res.json({ status, vehicles, bids });
  }
};

module.exports = { getStatus };
