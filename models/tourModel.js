/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
const mongoose = require('mongoose');
const slugify = require('slugify');// convert a string to URL-friendly version format called slug
// const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: [true, 'A tour must have id'],
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      maxlength: [64, 'A tour name must have less or equal than 64 characters'],
      //mostly used in e-mail
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    slug: String,//
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
      enum: {
        //enum is only for string
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
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
    priceDiscount: {
      type: Number,
      validate: {
        //Custom validator
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) shoud be below regular price',
      },
    },
    rating: {
      type: Number,
      default: 4,
      min: [1, 'Rating must be above or eqalt to 1'],
      max: [5, 'Rating must be less or equal to 5'],
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
      select: false, //unhide the field
    },
    startDates: [Date],
    secretTours: {
      type: Boolean,
      default: false,
      select:false
    },
  },
  { updatedAt: { type: Date } },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
tourSchema. virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
//Moongose middleware
//Docment Middleware
// works on save() and create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
//Query Middleware
//works on find, findById, findByIdAndUpdate, findByIdAndDelete
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTours: { $eq: false } });
  this.start = Date.now();
  next();
});
tourSchema.post(/^find/, function (next) {
  console.log(`Query took ${Date.now() - this.start} miliseconds!`);
});
//Model middleware
//Works on insertMany, deleteMany, deleteOne, update, updateOne
tourSchema.pre(['updateOne', 'updateMany'], function (next) {
  this.set({ updatedAt: new Date() });
  next();
});
//Aggregation middleware
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTours: { $ne: true } } });
});
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
