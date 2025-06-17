const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const router = require('./routes/tourRoutes');
const { Error } = require('mongoose');

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
app.all('/*routepath', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`
  // });
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.status = 'fail'
  err.statusCode =404;
  next(err);
});
app.use((err,req,res,next)=>{
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  })
})

module.exports = app;
