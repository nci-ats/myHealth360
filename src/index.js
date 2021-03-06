/*

                    __  __           ____  __   _____ _____ ____ 
   ____ ___  __  __/ / / /__  ____ _/ / /_/ /_ |__  // ___// __ \
  / __ `__ \/ / / / /_/ / _ \/ __ `/ / __/ __ \ /_ </ __ \/ / / /
 / / / / / / /_/ / __  /  __/ /_/ / / /_/ / / /__/ / /_/ / /_/ / 
/_/ /_/ /_/\__, /_/ /_/\___/\__,_/_/\__/_/ /_/____/\____/\____/  
          /____/                                                 

*/

//*******************************************************************

'use strict';

//*******************************************************************
// required modules

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const path = require('path');
const fsr = require('file-stream-rotator');
const mkdirp = require('mkdirp');
const morgan = require('morgan');

const bodyParser = require('body-parser');

const routes = require('./routes');

//*******************************************************************
// environment variables

const PORT = process.env.PORT || 8000;

//*******************************************************************
// express

const app = express();

app.use(cors());
app.use(helmet());
app.use(helmet.noCache());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// **********************************************************
// log

const logDirectory = path.join(__dirname, '../logs');
    
mkdirp(logDirectory);

const accessLogStream = fsr.getStream({
	filename: logDirectory + '/myHealth360-%DATE%.log',
	frequency: 'daily',
	verbose: false
});

app.use(morgan('combined', {stream: accessLogStream}));

//*******************************************************************
// public 

app.use(express.static('public/docs/api'));
app.use('/docs', express.static('public/docs/api'));
app.use('/api.json', express.static('public/docs/api/api.json'));

//*******************************************************************
// routes

app.use('/', routes);

//*******************************************************************
// listen

const server = app.listen(PORT, function () {

	const host = server.address().address;
	const port = server.address().port;

	console.log('\n  listening at http://%s:%s', host, port);

});

//*******************************************************************
// exports

module.exports = app;

//*******************************************************************
