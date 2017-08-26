const { getVehiclesInRange } = require('./store/vehicles');
const { hasStore } = require('./lib/environment');

// Create thrift connection to Captain
require('./client-thrift').start({port: 9090, host: 'localhost'});

const express = require('express');
const app = express();
const port = process.env.WEB_SERVER_PORT || 8888;

// Allow CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Define routes
app.get('/', function (req, res) {
  res.send('hello world');
});

app.get('/status', async function (req, res) {
  if (!hasStore) return res.json({ vehicles: [] });

  const vehicles = await getVehiclesInRange(
    { lat: parseFloat(req.query.lat), long: parseFloat(req.query.long) },
    7000
  );
  res.json({ vehicles });
});


module.exports = {
  start: () => {
    // Start the server
    app.listen(port, function() {
      console.log(`Web server started. Listening on port ${port}`);
    });
  }
};
