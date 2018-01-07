const cors = require('./middleware/cors');
const getOrCreateUser = require('./middleware/getOrCreateUser');

const StatusController = require('./controllers/StatusController');
const RequestController = require('./controllers/RequestController');
const MissionController = require('./controllers/MissionController');

// Create thrift connection to Captain
require('./client-thrift').start({
  port: process.env.CAPTAIN_PORT,
  host: process.env.CAPTAIN_HOST,
});

const express = require('express');
const app = express();
const port = process.env.WEB_SERVER_PORT || 8888;

app.use(cors);
app.use(getOrCreateUser);

app.get('/status', StatusController.getStatus);

app.get('/request/new', RequestController.newRequest);
app.get('/request/cancel', RequestController.cancelRequest);
app.get('/choose_bid', RequestController.chooseBid);

app.get('/mission_command', MissionController.command);

module.exports = {
  start: () => {
    // Start the server
    app.listen(port, () => {
      console.log(`Web server started. Listening on port ${port}`);
    });
  },
};
