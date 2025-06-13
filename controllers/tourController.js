/* eslint-disable no-restricted-syntax */
/* eslint-disable no-inner-declarations */
/* eslint-disable prefer-const */
/* eslint-disable no-restricted-globals */
/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-object-spread */
// const fs = require('fs');
const Tour = require('../models/tourModel');

const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,rating,summary,difficulty';
  next();
};
const getAllTours = async (req, res) => {
  try {
    console.log(req.query);
    // 1) Basic Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let queryObject = JSON.parse(queryStr);

    // Convert numeric strings to numbers, especially for operator values
    function convertValuesToNumbers(obj) {
      for (let key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          // If it's an object (like {"$gte": "5"}), recurse
          convertValuesToNumbers(obj[key]);
        } else if (typeof obj[key] === 'string' && !isNaN(obj[key])) {
          // If it's a string that can be converted to a number, convert it
          obj[key] = Number(obj[key]);
        }
      }
    }
    convertValuesToNumbers(queryObject); // Using the slightly modified function name
    console.log(queryObject); // This should show {"duration":{"$gte":5}}

    //2)sorting
    let query = Tour.find(queryObject);
    if (req.query.sort) {
      const sortBy = await req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
      //sort('price ratingsAverage)
    } else {
      query = query.sort('-createdAt');
    }

    //3) field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(`,`).join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-_v');
    }
    //4)Field pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    // Execute query
    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exist');
    }
    const tours = await query;
    // Send Response
    res.status(200).json({
      status: 'success',
      result: tours.length,
      data: {
        tours: tours,
      },
    });
  } catch (error) {
    console.error(`Error in getAllTours:`, error); // Log the actual error
    res.status(400).json({
      status: 'fail',
      message: error.message || 'An unknown error occurred', // Send error message
    });
  }
};
const createTour = async (req, res) => {
  try {
    const newTours = await Tour.create(req.body);
    res.status(200).json({
      status: 'sucess',
      data: {
        tours: newTours,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Same as Tour.findOne({_id: req.params.id})
    res.status(200).json({
      status: 'sucess',
      requestedAt: req.requestTime,
      data: {
        tours: tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      requestedAt: req.requestTime,
      message: error,
    });
  }
};
const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};
const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'sucess',
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};
module.exports = {
  getAllTours,
  createTour,
  getTourById,
  updateTour,
  deleteTour,
  aliasTopTours,
};
