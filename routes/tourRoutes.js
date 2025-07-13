/* eslint-disable import/no-useless-path-segments */
const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/stats').get(tourController.getTourStats);
router.route('/yearlyplan/:year').get(tourController.monthlyPlan);
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTourById)
  .patch(authController.protect, tourController.updateTour)
  .delete(authController.protect, tourController.deleteTour);

module.exports = router;
