import Campground from '../models/campground.mjs';
import log from '../utils/log.mjs';

const CampgroundService = {};

CampgroundService.getAllCampgrounds = async () => {
    const fetchedCampgrounds = await Campground.find({}, (error, foundCampgrounds) => {
        if (error) log(error, 'error');
        return Array.isArray(foundCampgrounds) ? foundCampgrounds : [];
    });
    return fetchedCampgrounds;
};

CampgroundService.createCampground = async (campgroundData) => {
    const createdCampground = await Campground.create(campgroundData, (error, newlyCreatedCampground) => {
        if (error) log(error, 'error');
    });
    return createdCampground;
};

CampgroundService.getCampgroundWithID = async (id) => {
    await Campground.findById(id)
        .populate('comments')
        .exec((err, foundCampground) => {
            if (err || !foundCampground) {
                req.flash('error', 'Campground not found');
                res.redirect('back');
            } else {
                res.render('campgrounds/show', { campground: foundCampground });
            }
        });
};

//EDIT
CampgroundService.editCampground = (id) => {
    Campground.findById(id, (err, foundCampground) => {
        if (err) log(err, 'error');
        res.render('campgrounds/edit', { campground: foundCampground });
    });
};

//UPDATE
CampgroundService.updateCampground = (id, campgroundData) => {
    Campground.findByIdAndUpdate(id, campgroundData, (err, updatedCampground) => {
        if (err) {
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
};

//DELETE
CampgroundService.deleteCampground = async (id, callback) => {
    await Campground.findByIdAndRemove(id, (err) => {
        if (err) {
            routeErrorHandler(err, res, redirectRoute);
        }
    });
    return callback();
};

export default CampgroundService;
