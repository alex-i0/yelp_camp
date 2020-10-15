import express from 'express';
import Campground from '../models/campground.mjs';
import middleware from '../middleware/index.mjs';
import log from '../utils/log.mjs';

const router = express.Router();

//INDEX
router.get('/', (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
        if (err) {
            log(err, 'error');
        } else {
            res.render('campgrounds/index', { campgrounds: allCampgrounds });
        }
    });
});

router.post('/', middleware.isLoggedIn, (req, res) => {
    const { name, image, description, price } = req.body;
    const author = {
        id: req.user._id,
        username: req.user.username
    };

    const newCampground = { name, image, description, price, author };

    Campground.create(newCampground, (err, newlyCreated) => {
        if (err) {
            log(err, 'error');
        } else {
            res.redirect('/campgrounds');
        }
    });
});
//NEW
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});
//SHOW
router.get('/:id', (req, res) => {
    Campground.findById(req.params.id)
        .populate('comments')
        .exec((err, foundCampground) => {
            if (err || !foundCampground) {
                req.flash('error', 'Campground not found');
                res.redirect('back');
            } else {
                res.render('campgrounds/show', { campground: foundCampground });
            }
        });
});

//EDIT
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render('campgrounds/edit', { campground: foundCampground });
    });
});

//UPDATE
router.put('/:id', (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if (err) {
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

//DELETE
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            log(err, 'error');
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds');
        }
    });
});

export default router;
