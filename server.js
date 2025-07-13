/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log(`UNCAUGHT EXCEPTION!🙅‍♂️ Shutting Down...`);
  console.log(err, err.message);
});
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log(`UNHANDLED REJECTION😑! SHUTTING DOWN`);
});
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DB_CONNECT.replace(
  '<db_password>',
  process.env.DB_PASS
).replace('<db_name>', process.env.DB_NAME);
// const DB = process.env.LOCAL_DB.replace('<db_name>', process.env.DB_NAME);
mongoose
  .connect(DB)
  .then(() => {
    console.log('Database connection successful');
  })
  .catch((err) => {
    console.log('Database connection failed:', err.message);
    process.exit(1);
  });

// Correct port fallback logic
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
