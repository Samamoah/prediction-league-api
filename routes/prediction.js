const express = require('express');
const router = express.Router();

const {
  getPrediction,
  getPredictions,
  createPrediction,
  findPrediction,
  awardPredictionUser,
} = require('../controllers/prediction');

//router.route('/').get(getPredictions);

// router.route('/join/:Predictionid/:userid').post(joinPrediction);

router.route('/create').post(createPrediction);
router.route('/week/:user').get(findPrediction);
router.route('/award/:user').get(awardPredictionUser);
router.route('/:id').get(getPrediction);
router.route('/').get(getPredictions);

// router.route('/update/:id').put(updateGroup);

// router.route('/delete/:id').delete(deleteGroup);

module.exports = router;
