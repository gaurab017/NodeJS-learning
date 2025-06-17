const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const AppError = require('./utils/appError');
const router = require('./routes/tourRoutes');
const errorController = require('./controllers/errorController');

dotenv.config({ path: './config.env' });

const app = express();
const globalErrorHandler = errorController;
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
app.all('/*splat', (req, res, next) => {
  
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
