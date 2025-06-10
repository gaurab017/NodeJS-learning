/* eslint-disable prefer-object-spread */
const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours.json`)
);

const checkID = (req, res, next, val) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};
const checkBody = (req, res, next, val) => {
  if (!req.body.name && !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing price or name',
    });
  }
  next();
};
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'sucess',
    data: {
      tours: tours,
    },
  });
};
const postTour = (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours, null, 2),
    () => {
      res.status(200).json({
        status: 'sucess',
        data: {
          tours: newTour,
        },
      });
    }
  );
};

const getTourById = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((e) => e.id === id);
  res.status(200).json({
    status: 'sucess',
    requestedAt: req.requestTime,
    data: {
      tours: tour,
    },
  });
};
const updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: `<Updated tour here...>`,
    },
  });
};

const deleteTour = (req, res) => {
  res.status(204).json({
    status: 'sucess',
    data: null,
  });
};
module.exports = {
  getAllTours,
  postTour,
  getTourById,
  updateTour,
  deleteTour,
  checkID,
  checkBody,
};
