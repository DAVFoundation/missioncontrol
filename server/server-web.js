const express = require('express');
const { getVehicles } = require('./simulation/vehicles');

const app = express();
const port = process.env.WEB_SERVER_PORT || 8888;


// Define routes
app.get('/', function (req, res) {
  res.send('hello world');
});

app.get('/status', function (req, res) {
  res.send({
    vehicles: getVehicles({
      userId: req.query.id,
      coords: { lat: req.query.lat, long: req.query.long }
    })
  });
});


module.exports = {
  start: () => {
    // Start the server
    app.listen(port, function() {
      console.log(`Web server started. Listening on port ${port}`);
    });
  }
};
