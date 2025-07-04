/* eslint-disable import/no-useless-path-segments */
const express = require('express');
const tourController = require('./../controllers/tourController');

const router = express.Router();

router
  .route('/yearlyplan/:year')
  .get(tourController.monthlyPlan)
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
router
  .route('/stats')
  .get(tourController.getTourStats)
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTourById)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
