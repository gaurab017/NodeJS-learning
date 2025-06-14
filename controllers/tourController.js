const { APIFeatures } = require('../utils/apiFeatures');
const Tour = require('../models/tourModel');

// Middleware to pre-fill query parameters
const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,rating,summary,difficulty';
  next();
};

const getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(
      Tour.find(),
      req.query,
      req._parsedUrl.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
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
