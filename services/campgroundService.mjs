import Campground from '../models/campground.mjs';
import log from '../utils/log.mjs';

const getAllCampgrounds = async () => {
    let campgrounds = null;
    await Campground.find({}, (error, allCampgrounds) => {
        if (error) log(error, 'error');
        campgrounds = allCampgrounds;
    });
    return campgrounds;
};

const createCampground = (campgroundData) => {
    Campground.create(campgroundData, (error, newlyCreated) => {
        if (error) log('Creating new campground has failed.', 'error');
        req.flash('success', 'Campground has been created successfully ');
    });
};

const getCampgroundWithID = (id) => {
    Campground.findById(id)
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
const editCampground = (id) => {
    Campground.findById(id, (err, foundCampground) => {
        if (err) log(err, 'error');
        res.render('campgrounds/edit', { campground: foundCampground });
    });
};

//UPDATE
const updateCampground = (id, campgroundData) => {
    Campground.findByIdAndUpdate(id, campgroundData, (err, updatedCampground) => {
        if (err) {
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
};

//DELETE
const deleteCampground = (id) => {
    Campground.findByIdAndRemove(id, (err) => {
        if (err) {
            log('Campground not found', 'error');
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds');
        }
    });
};

export { getAllCampgrounds, createCampground, getCampgroundWithID, editCampground, updateCampground, deleteCampground };
