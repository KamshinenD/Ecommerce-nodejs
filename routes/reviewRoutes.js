const express = require("express");
const { getAllReviews, getSingleReview, updateReview, deleteReview, createReview, getAllReviewsByProduct } = require("../controllers/reviewController");
const { authenticateUser } = require("../middleware/authentication");
const router = express.Router();


router.route('/').post(authenticateUser, createReview).get(getAllReviews);
router.route('/getAllByProduct/:id').get(getAllReviewsByProduct); //duplicated in the product route
router.route('/:id').get(getSingleReview).patch(authenticateUser, updateReview).delete(authenticateUser, deleteReview);


module.exports= router;