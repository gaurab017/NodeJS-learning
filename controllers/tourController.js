const { APIFeatures } = require('../utils/apiFeatures');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Middleware to pre-fill query parameters
const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

const getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query, req._parsedUrl.query)
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
});

const createTour = catchAsync(async (req, res, next) => {
  const newTours = await Tour.create(req.body);
  res.status(200).json({
    status: 'success',
    data: {
      tours: newTours,
    },
  });
});

const getTourById = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: {
      tour,
    },
  });
});

const updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404)); // ✅ Added missing next
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
});

const deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404)); // ✅ Added missing next
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const getTourStats = catchAsync(async (req, res, next) => {
  try {
    console.log('Starting getTourStats aggregation');

    const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          _id: '$difficulty',
          numTours: { $sum: 1 },
          numRating: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      { $sort: { avgPrice: 1 } },
    ]);

    console.log('Aggregation result:', stats);

    if (!stats || stats.length === 0) {
      return next(new AppError('No tour stats found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: stats,
    });
  } catch (err) {
    return next(new AppError(`Aggregation error: ${err.message}`, 500));
  }
});

const monthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  console.log('Starting monthlyPlan aggregation for year:', year);
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    { $addFields: { month: '$_id' } },
    {
      $project: {
        _id: 0,
      },
    },
    { $sort: { numTourStarts: -1 } },
    { $limit: 12 },
  ]);
  res.status(200).json({
    status: 'success',
    data: plan,
  });
});

module.exports = {
  getAllTours,
  createTour,
  getTourById,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  monthlyPlan,
};
