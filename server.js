/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DB_CONNECT.replace('<db_password>', process.env.DB_PASS);

mongoose
  .connect(DB)
  .then(() => {
    console.log('Database connection successful');
  })
  .catch((error) => console.log('Error connecting to Database', error));
const tourSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: [true, 'A tour must have id'],
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
  },
  price: {
    type: Number,
    required: [true, 'A tour must have price'],
  },
  rating: {
    type: Number,
    default: 4,
  },
});
const Tour = mongoose.model('Tour', tourSchema);
const testTour = new Tour({
  id: 796,
  name: 'The Park Camper',
  price: 997,
});
testTour
  .save()
  .then((doc) => console.log(doc))
  .catch((err) => console.log('Error', err));
// Correct port fallback logic
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
