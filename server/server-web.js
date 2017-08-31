const { getVehiclesInRange } = require('./store/vehicles');
const { getBidsForRequest } = require('./store/bids');
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
  const vehicles =
    (!hasStore) ? [] : await getVehiclesInRange(
      { lat: parseFloat(req.query.lat), long: parseFloat(req.query.long) },
      7000
    );

  const bidRequestId = req.query.requestId;
  const bids = (!hasStore || !bidRequestId) ? [] : await getBidsForRequest(bidRequestId);

  res.json({ vehicles, bids });
});

module.exports = {
  start: () => {
    // Start the server
    app.listen(port, () => {
      console.log(`Web server started. Listening on port ${port}`);
    });
  }
};
