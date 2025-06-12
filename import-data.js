/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');

dotenv.config({ path: './config.env' });
const Tour = require('./models/tourModel');

const DB = process.env.DB_CONNECT.replace('<db_password>', process.env.DB_PASS);
mongoose
  .connect(DB)
  .then(() => {
    console.log('Database connection successful');
  })
  .catch((error) => console.log('Error connecting to Database', error));

const importData = async (filePath) => {
  try {
    const tours = JSON.parse(fs.readFileSync(`${filePath}`, 'utf8'));
    await Tour.create(tours);
    console.log('Data successfully imported');
    process.exit();
  } catch (error) {
    console.log('Error occurred while importing', error);
    process.exit();
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted');
    process.exit();
  } catch (error) {
    console.log('Error occurred while deleting', error);
    process.exit();
  }
};

if (process.argv[2] === '--import') {
  const filePath = process.argv[3];
  if (!filePath) {
    console.log('Error: File path not provided');
    process.exit();
  }
  importData(filePath);
} else if (process.argv[2] === '--delete') {
  deleteData();
}
