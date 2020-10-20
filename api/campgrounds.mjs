import express from 'express';
import Campground from '../models/campground.mjs';
import middleware from '../middleware/index.mjs';
import log from '../utils/log.mjs';
import { getAllCampgrounds, createCampground, deleteCampground } from '../services/campgroundService.mjs';

const router = express.Router();

router.get('/', async (req, res) => {
    const fetchedCampgrounds = await getAllCampgrounds();
    res.render('campgrounds/index', { campgrounds: fetchedCampgrounds });
});

router.post('/', middleware.isLoggedIn, async (req, res) => {
    const { name, image, description, price } = req.body;
    const author = {
        id: req.user._id,
        username: req.user.username
    };

    const newCampground = { name, image, description, price, author };

    await createCampground(newCampground, () => {
        req.flash('success', 'Campground has been created successfully.');
        res.redirect('/campgrounds');
    });
});

router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

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
        if (err) log(err, 'error');
        res.render('campgrounds/edit', { campground: foundCampground });
    });

    res.render('campgrounds/edit', { campground: foundCampground });
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
router.delete('/:id', middleware.checkCampgroundOwnership, async (req, res) => {
    await deleteCampground(req.params.id, () => {
        res.redirect('/campgrounds');
    });
});

export default router;
