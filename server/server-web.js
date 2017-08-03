const express = require('express');

const app = express();
const port = 8443;


// Define routes
app.get('/', function (req, res) {
  res.send('hello world');
});



module.exports = {
  start: () => {
    // Start the server
    app.listen(port, function() {
      console.log(`Web server started. Listening on port ${port}`);
    });
  }
};
