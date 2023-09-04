const express = require('express');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const router = express.Router();
const app = express();
const { isLoggedIn, validateCapmground, isAuthor } = require('../middlware');
const campgrounds = require('../controllers/campground');
const multer = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });


router.get('/', catchAsync(campgrounds.index));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.post('/', isLoggedIn, upload.array('image'), validateCapmground, catchAsync(campgrounds.createNewCampground));


router.get('/:id', catchAsync(campgrounds.showCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateCapmground, catchAsync(campgrounds.updateCapmground));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;
