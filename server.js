/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', err=>{
  console.log(`UNCAUGHT EXCEPTION!🙅‍♂️ Shutting Down...`);
  console.log(err, err.message);
})
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log(`UNHANDLED REJECTION😑! SHUTTING DOWN`);
});
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DB_CONNECT.replace('<db_password>', process.env.DB_PASS);

mongoose
  .connect(DB)
  .then(() => {
    console.log('Database connection successful');
  })
  .catch()

// Correct port fallback logic
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
