const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const router = require('./routes/tourRoutes');

dotenv.config({ path: './config.env' });

const app = express();
//middleware
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.static(`${__dirname}/public`));

// Custom middleware to add request time
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Route mounting
app.use('/api/v1/tours', router);

// Catch-all route for unmatched routes
// '/*' is depreciated in express 5
//So use /*any_name 
app.all('/*routepath', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});


module.exports = app;
