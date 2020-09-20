const express = require('express');
var ejwt = require('express-jwt');
const router = express.Router();

const {
  getPrediction,
  getPredictions,
  createPrediction,
  findPrediction,
  findUserPredictions,
  awardPredictionUser,
  awardPredictionUsers,
  awardPredictionGraphUser,
} = require('../controllers/prediction');

//router.route('/').get(getPredictions);

// router.route('/join/:Predictionid/:userid').post(joinPrediction);

router
  .route('/create')
  .post(ejwt({ secret: process.env.JWT_SECRET }), createPrediction);
router
  .route('/week/:user/:matchday')
  .get(ejwt({ secret: process.env.JWT_SECRET }), findPrediction);
router
  .route('/all/:user')
  .get(ejwt({ secret: process.env.JWT_SECRET }), findUserPredictions);
router.route('/score/users').put(awardPredictionUsers);
router.route('/award/:user').get(awardPredictionUser);
router
  .route('/graph/:user')
  .get(ejwt({ secret: process.env.JWT_SECRET }), awardPredictionGraphUser);
router
  .route('/:id')
  .get(ejwt({ secret: process.env.JWT_SECRET }), getPrediction);
router.route('/').get(ejwt({ secret: process.env.JWT_SECRET }), getPredictions);

// router.route('/update/:id').put(updateGroup);

// router.route('/delete/:id').delete(deleteGroup);

module.exports = router;
