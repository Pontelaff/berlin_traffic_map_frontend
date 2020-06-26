const express   = require('express');
const secRoutes = require('express').Router();
const proxy     = require('express-http-proxy');
const basicAuth = require('express-basic-auth');
const http      = require('http');
const path      = require('path');

const app = express();
const port = 3020;

const root = path.join(__dirname, '..', 'dist/bb-traffic');

/* Shutdown server, when a request to /shutdown is sent */
/* Secure /secure/shutdown with authentication */
secRoutes.use(basicAuth({
    users: { 'admin' : 'bsbpw123456' }
}));
secRoutes.get('/shutdown', function(req, res) {
    res.send('shutdown');
    console.log('shutdown received');
    server.close();
    console.log('Http Server closed.');
});
app.use('/secure', secRoutes);
/* Proxy calls to /api to the REST-API */
app.use('/api', proxy('localhost:3021'));
app.use('/bsb/api', proxy('localhost:3021'));
/* Serve Angular App */
app.use('/bsb', express.static(root));
app.get('/bsb/*', (req, res) => {
    res.sendFile(path.join(root, 'index.html'));
});

const server = http.createServer(app);
server.listen(port, () => console.log(`App running on: http://localhost:${port}`));
