require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const cors         = require('cors');
const passport     = require('passport');
const session      = require('express-session');

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

require('./configs/session.config')(app);

// require database configuration
require('./configs/db.config');

require('./configs/passport.config');

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
}));

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: 'true',
    saveUninitialized: 'true',
  })
);

app.use(passport.initialize());
app.use(passport.session());

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

app.use('/', require('./routes/index.routes'));
app.use('/', require('./routes/auth.routes'));
app.use('/', require('./routes/book.routes'));

module.exports = app;
