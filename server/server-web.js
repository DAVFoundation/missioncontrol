const express = require('express');

const app = express();
const port = 8443;


// Define routes
app.get('/', function (req, res) {
  res.send('hello world');
});


// Start the server
app.listen(port, function() {
  console.log(`Mission Control web server started.`);
  console.log(`Listening on port ${port}`);
});
