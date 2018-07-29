import app from './App';
// import * as https from 'https';

const PORT = process.env.PORT || 3005;
// Create Express server
app.listen(PORT, () => {
  // tslint:disable-next-line:no-console
  console.log(`Web server started. Listening on port ${PORT}`);
});
