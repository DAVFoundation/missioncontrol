const { getMission, updateMission } = require('../store/missions');
const { createMissionUpdate, createMission } = require('../store/mission_updates');
const { getVehicle, updateVehiclePosition } = require('../store/vehicles');
const { updateCaptainStatus } = require('../store/captains');
const { getBid } = require('../store/bids');
const validate = require('../lib/validate');
const updateConstraints = require('./constraints/mission/update');
const beginConstraints = require('./constraints/mission/begin');

const begin = async (req, res) => {
  const { bidId } = req.params;
  const params = req.body;
  params.bid_id = bidId;
  const validationErrors = validate(params, beginConstraints);
  if (validationErrors) {
    res.status(422).json(validationErrors);
  } else {
    const bid = await getBid(bidId);
    if (!bid || /* (bid.status !== 'contractSigned') || */ (bid.dav_id !== params.dav_id)) {
      res.status(401).send('Unauthorized');
    } else {
      let mission = await createMission(bidId);
      // await updateVehiclePosition(mission.vehicle, params.longitude, params.latitude);
      mission = await getMission(mission.mission_id); //refresh mission
      if (mission) {
        res.json({ mission });
      } else {
        res.status(500).send('Something broke!');
      }
    }
  }
};

const fetch = async (req, res) => {
  const { missionId } = req.params;
  let mission = await getMission(missionId);
  if (mission) {
    res.json(mission);
  } else {
    res.status(400).send('No mission!');
  }
};

const update = async (req, res) => {
  const { missionId } = req.params;
  const { user_id } = req.query;
  const params = req.body;
  const validationErrors = validate(params, updateConstraints);
  if (validationErrors) {
    res.status(422).json(validationErrors);
  } else {
    let mission = await getMission(missionId); // redis.hgetallAsync(`missions:${missionId}`); returns null at this point
    if((params.captain_id && mission.vehicle_id === params.captain_id) ||
     (user_id && mission.user_id === user_id)) {
      const vehicle = await getVehicle(mission.vehicle_id);
      const { status, longitude, latitude } = params;
      if(status) {
        const key = `${status}At`;
        const updateParams = { status: status };
        updateParams[key] = Date.now();
        await updateMission(missionId, updateParams);
        createMissionUpdate(missionId, status);
      }
      if(longitude && latitude) {
        await updateVehiclePosition(vehicle, longitude, latitude);
      }
      if(params.vehicle_status && params.mission_status) {
        await updateMission(missionId, { [params.mission_status + '_at']: Date.now() });
        await updateCaptainStatus(mission.vehicle_id, params.vehicle_status);
        createMissionUpdate(missionId, params.mission_status);
      }
      mission = await getMission(missionId); //refresh mission 
      res.status(200).json(mission);
    } else {
      res.status(401).send('Unauthorized');
    }
  }
};

const fetchMissionByBidId = async (req, res) => {
  const { bidId } = req.params;
  let mission = await getMission(bidId);
  if (mission) {
    res.json(mission);
  } else {
    res.status(400).send('No mission!');
  }
};

const command = async (req, res) => {
  const { user_id, mission_id, command} = req.query;
  if(mission_id==='undefined')
  {
    res.sendStatus(404);
    return;
  }
  let mission = await getMission(mission_id);
  let vehicle = await getVehicle(mission.vehicle_id);

  if (user_id !== mission.user_id) return res.sendStatus(401);

  if (command === 'takeoff_pickup' && vehicle.status === 'waiting_pickup'){
    await updateMission(mission_id, {'takeoff_pickup_at': Date.now()});
    await createMissionUpdate(mission_id, 'takeoff_pickup');
    await updateCaptainStatus(mission.vehicle_id, 'takeoff_pickup');
  }

  // update mission and vehicle
  mission = await getMission(mission_id);
  vehicle = await getVehicle(mission.vehicle_id);

  res.json({vehicle, mission});
};

const updateGraddPayload = async (req,res) => {
  try{
    //prepare params
    //todo: this has not been tested after the route was refactored to /:missions
    let mission_id = req.params.mission_id;
    let gradd_payload = req.params.gradd_payload;
    await updateMission(mission_id, {'gradd_payload':gradd_payload});
    //todo: check for errors in updateMission
    //todo: should we email the user with the payload?
    res.status(200).send('Payload stored successfully');
  } catch(err){
    console.log('updateGraddPayload error: '+err);
    res.status(500).send('Unexpected error');
  }
};

module.exports = { begin, fetch, fetchMissionByBidId, update, command, updateGraddPayload };
