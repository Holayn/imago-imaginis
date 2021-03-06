/**
 * Imagino Imaginis
 * ----------------------------------------------------------------
 * This is the core API server, served on https.
 * It serves as the middleware between the database and the front-end and stylizer.
 * This API may also be used by users outside of the website, provided they are a paid user.
 */
const express = require('express');
const bodyParser = require('body-parser'); // required to parse JSON 
const mountRoutes = require('./app/routes');
const https = require('https'); // serve on https
const fs = require('fs');

const app = express();

var config;
try {
    config = require('./config.js');
} catch (e) {
    console.log("ERROR: Could not find `config.js`. Have you tried copying `config.js.template` to `config.js` (and populating the relevant fields)?");
    process.exit(1);
}


// Allows for cross-origin resource sharing
// https://github.com/expressjs/cors
var cors = require('cors');
var helmet = require('helmet');

const port = 8000;

console.log(__dirname);

//This allows Express to process URL encoded forms on its own.
//This way, we don't get undefined when receiving JSON
app.use(bodyParser.json());
app.use(bodyParser.raw({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());
app.use(helmet());

console.log(config);
app.use(express.static(config.serve));

const options = {
  cert: fs.readFileSync('./fullchain.pem'),
  key: fs.readFileSync('./privkey.pem')
}

require('./app/routes')(app);
https.createServer(options, app).listen(port, () => {
    console.log('We are live on ' + port);
});
