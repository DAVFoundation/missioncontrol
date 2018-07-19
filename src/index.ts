import app from './app';
import * as https from 'https';

const PORT = process.env.PORT || 3005;
// Create Express server
app.listen(PORT, () => {
    console.log(`Web server started. Listening on port ${PORT}`);
});
