const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const router = require('./routes/tourRoutes');

dotenv.config({ path: './config.env' });

const app = express();

// 1) Middleware
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) Route Handlers
app.use('/api/v1/tours', router);

module.exports = app;
