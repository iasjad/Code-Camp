const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary/index');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });


module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = (req, res) => {

    res.render('campgrounds/new');
}

module.exports.createNewCampground = async (req, res, next) => {
    const geoDate = await geocoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body);
    campground.geometry = geoDate.body.features[0].geometry;
    campground.images = req.files.map(f => ({ URL: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    req.flash('sucsses', 'Succusfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);

}

module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({ path: 'review', populate: { path: 'author' } }).populate('author');
    if (!campground) {
        req.flash('error', 'can\'t find the campground')
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'can\'t find the campground')
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCapmground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body })
    const img = req.files.map(f => ({ URL: f.path, filename: f.filename }));
    campground.images.push(...img);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('sucssus', 'Updated sucssufully');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('sucsses', 'Sucssesfully deleted a campground ');
    res.redirect('/campgrounds');
}