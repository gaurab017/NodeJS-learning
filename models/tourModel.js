/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
const mongoose = require('mongoose');

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
  duration: {
    type: Number,
    required: [true, 'A tour must have a durination'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have difficulty'],
  },
  ratingAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have price'],
  },
  rating: {
    type: Number,
    default: 4,
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have description'],
    maxlength: 75,
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
