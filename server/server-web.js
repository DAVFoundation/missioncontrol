const { getVehiclesInRange, updateVehicleStatus, getVehicle } = require('./store/vehicles');
const { getBidsForRequest, deleteBidsForRequest } = require('./store/bids');
const { getOrCreateUser } = require('./store/users');
const { createRequest, getRequest, deleteRequest } = require('./store/requests');
const { createMission, getLatestMissionId, getMission, updateMission } = require('./store/missions');
const { hasStore } = require('./lib/environment');

// Create thrift connection to Captain
require('./client-thrift').start({port: process.env.CAPTAIN_PORT, host: process.env.CAPTAIN_HOST});

const express = require('express');
const app = express();
const port = process.env.WEB_SERVER_PORT || 8888;

// Allow CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Get or create user
app.use(async (req, res, next) => {
  const { user_id } = req.query;
  let user = await getOrCreateUser(user_id);
  req.user = user;
  next();
});

// Define routes
app.get('/', (req, res) => {
  res.send('hello world');
});

app.get('/status', async (req, res) => {
  const { lat, long, requestId, user_id } = req.query;
  const status = 'idle';
  const latestMissionId = await getLatestMissionId(user_id);
  const latestMission = await getMission(latestMissionId);
  const vehicles =
    (!hasStore()) ? [] : await getVehiclesInRange(
      { lat: parseFloat(lat), long: parseFloat(long) },
      7000
    );
  const bids = (!hasStore() || !requestId) ? [] : await getBidsForRequest(requestId);

  if (latestMission) {
    switch (latestMission.status) {
    case 'awaiting_signatures': {
      let elapsedTime = Date.now() - latestMission.signed_at;
      let elapsedSeconds = ((elapsedTime % 60000) / 1000).toFixed(0);
      if (elapsedSeconds > 6) {
        await updateMission(latestMissionId, 'vehicle_signed_at', Date.now());
        await updateMission(latestMissionId, 'status', 'in_progress');
        await updateVehicleStatus(latestMission.vehicle_id, 'travelling_pickup');
      }
      res.json({status, vehicles, bids});
      break;
    }
    case 'in_progress': {
      const mission = latestMission;
      const vehicle = await getVehicle(latestMission.vehicle_id);
      const status = 'in_mission';
      res.json({status, mission, vehicle});
      break;
    }
    }
  } else {
    res.json({ status, vehicles, bids });
  }
});

app.get('/request/new', async (req, res) => {
  const { user_id, pickup, dropoff, requested_pickup_time, size, weight } = req.query;
  const requestId = await createRequest({
    user_id, pickup, dropoff, requested_pickup_time, size, weight
  });
  if (requestId) {
    res.json({ requestId });
  } else {
    res.status(500).send('Something broke!');
  }
});

app.get('/request/cancel', async (req, res) => {
  const { requestId } = req.query;
  const request = await getRequest(requestId);
  if (request) {
    await deleteRequest(requestId);
    await deleteBidsForRequest(requestId);
    res.send('request cancelled');
  } else {
    res.status(500).send('Something broke!');
  }
});

app.get('/choose_bid', async (req, res) => {
  const { user_id, bid_id } = req.query;
  const mission = await createMission({
    user_id, bid_id
  });
  if (mission) {
    await updateVehicleStatus(mission.vehicle_id, 'contract_received');
    res.json({ mission });
  } else {
    res.status(500).send('Something broke!');
  }
});

module.exports = {
  start: () => {
    // Start the server
    app.listen(port, () => {
      console.log(`Web server started. Listening on port ${port}`);
    });
  }
};
