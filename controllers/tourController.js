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

const checkBody = (req, res, next, val) => {
  if (!req.body.name && !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing price or name',
    });
  }
  next();
};
 const getAllTours = async (req, res) => {
  try {
    console.log(typeof req.query);
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

    // Execute query
    const query = Tour.find(queryObject);
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
  // checkID,
  checkBody,
};
