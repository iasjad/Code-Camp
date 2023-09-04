const express = require('express');
const catchAsync = require('../utils/catchAsync');
const ExpressErrors = require('../utils/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review');
const { reviewSchema } = require('../Schemas');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middlware');
const reviews = require('../controllers/review');
const router = express.Router({ mergeParams: true });
const app = express();



router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));


module.exports = router;