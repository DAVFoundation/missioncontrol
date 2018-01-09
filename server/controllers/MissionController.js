const { getMission, updateMission } = require('../store/missions');
const { createMissionUpdate } = require('../store/mission_updates');
const { getVehicle, updateVehicleStatus } = require('../store/vehicles');


const command = async (req, res) => {
  const { user_id, mission_id, command} = req.query;
  let mission = await getMission(mission_id);
  let vehicle = await getVehicle(mission.vehicle_id);

  if (user_id !== mission.user_id) return res.sendStatus(401);

  if (command === 'takeoff_pickup' && vehicle.status === 'waiting_pickup'){
    await updateMission(mission_id, {'takeoff_pickup_at': Date.now()});
    await createMissionUpdate(mission_id, 'takeoff_pickup');
    await updateVehicleStatus(mission.vehicle_id, 'takeoff_pickup');
  }

  // update mission and vehicle

  mission = await getMission(mission_id);
  vehicle = await getVehicle(mission.vehicle_id);

  res.json({vehicle, mission});
};

module.exports = { command };
