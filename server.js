/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });
const app = require('./app');
// const Tour = require('./models/tourModel');

const DB = process.env.DB_CONNECT.replace('<db_password>', process.env.DB_PASS);

mongoose
  .connect(DB)
  .then(() => {
    console.log('Database connection successful');
  })
  .catch((error) => console.log('Error connecting to Database', error));

// Correct port fallback logic
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
