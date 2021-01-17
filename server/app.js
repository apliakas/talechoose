require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
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
app.use(bodyParser.json({limit: "1mb"}));
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
app.use('/api', require('./routes/auth.routes'));
app.use('/api', require('./routes/book.routes'));
app.use('/api', require('./routes/user.routes'));

app.use('/static', express.static(path.join(__dirname, '../client/build/static')));
app.use('/', express.static(path.join(__dirname, '../client/build/')));
app.get('*', function(request, response) {
  response.sendFile('index.html', {root: path.join(__dirname, '../client/build/')});
});

module.exports = app;
