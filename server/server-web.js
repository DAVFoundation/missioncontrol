const { getVehiclesInRange } = require('./store/vehicles');
const { getBidsForRequest, deleteBidsForRequest } = require('./store/bids');
const { createRequest, getRequest, deleteRequest } = require('./store/requests');
const { createMission } = require('./store/missions');
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

// Define routes
app.get('/', (req, res) => {
  res.send('hello world');
});

app.get('/status', async (req, res) => {
  const { lat, long, requestId } = req.query;
  const vehicles =
    (!hasStore()) ? [] : await getVehiclesInRange(
      { lat: parseFloat(lat), long: parseFloat(long) },
      7000
    );

  const bids = (!hasStore() || !requestId) ? [] : await getBidsForRequest(requestId);

  res.json({ vehicles, bids });
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
