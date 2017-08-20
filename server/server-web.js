const express = require('express');

const app = express();
const port = process.env.WEB_SERVER_PORT || 8888;


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
