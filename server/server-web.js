const cors = require('./middleware/cors');
const getOrCreateUser = require('./middleware/getOrCreateUser');

const StatusController = require('./controllers/StatusController');
const NeedController = require('./controllers/NeedController');
const BidController = require('./controllers/BidController');
const MissionController = require('./controllers/MissionController');
const VehicleController = require('./controllers/VehicleController');
const CaptainController = require('./controllers/CaptainController');
// const ContractController = require('./controllers/ContractController');

// Create thrift connection to Captain
require('./client-thrift').start({
  port: process.env.CAPTAIN_PORT,
  host: process.env.CAPTAIN_HOST,
});

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.WEB_SERVER_PORT || 8888;

app.use(cors);
app.use(bodyParser.json());
app.use(getOrCreateUser);

app.get('/healthy', (req, res) => {
  res.send('hello world');
});

app.get('/status', StatusController.getStatus);

app.post('/needs', NeedController.create);
app.delete('/needs/:needId', NeedController.cancel);
app.get('/needs/:davId', NeedController.getForCaptain);

app.post('/bids/:needId', BidController.create);
app.get('/bids/:needId', BidController.fetch);
app.put('/bids/:bidId/choose', BidController.chooseBid);
app.get('/bids/:davId/chosen', BidController.fetchChosen);
app.get('/bids/:bidId/mission', MissionController.fetchMissionByBidId);

app.get('/mission_command', MissionController.command);


// endpoints for captain/dav-js
app.post('/captains', CaptainController.create);
app.post('/captains/:davId', CaptainController.registerNeedTypeForCaptain);
app.put('/captains/:davId', CaptainController.registerNeedTypeForCaptain);

// app.post('/contracts/:bidId', ContractController.sign);
app.post('/missions/:bidId', MissionController.begin);
app.put('/missions/:missionId', MissionController.update);
app.get('/missions/:missionId', MissionController.fetch);

app.get('/vehicles/:vehicleId', VehicleController.fetch);
app.put('/vehicles/:vehicleId', VehicleController.update);
app.post('/vehicles', VehicleController.create);

// const coexDrone = require('./coex/drone');
// const davSDK = require('./lib/dav');

module.exports = {
  start: async () => {
    // await coexDrone.init();
    // davSDK.init().catch(err => {
    //   console.log(err);
    // });
    // Start the server
    app.listen(port, () => {
      console.log(`Web server started. Listening on port ${port}`);
    });
  },
};
