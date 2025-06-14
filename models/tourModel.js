/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
const mongoose = require('mongoose');
const slugify = require('slugify');

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
    },
    slug: String,
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
      select: false, //unhide the field
    },
    startDates: [Date],
    secretTours: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//Docment Middleware  
// pre runs before save() and create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
//Query Middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $eq: false } });
  this.start = Date.now();
  next();
});
tourSchema.post(/^find/, function(next){
  console.log(`Query took ${Date.now()-this.start} miliseconds!`);
  
})

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
