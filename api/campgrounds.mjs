import express from 'express';
import Campground from '../models/campground.mjs';
import AuthService from '../services/authService.mjs';
import log from '../utils/log.mjs';
import CampgroundService from '../services/campgroundService.mjs';

const router = express.Router();

router.get('/', async (req, res) => {
    const fetchedCampgrounds = await CampgroundService.getAllCampgrounds();
    res.render('campgrounds/index', { campgrounds: fetchedCampgrounds });
});

router.post('/', AuthService.isLoggedIn, async (req, res) => {
    const { name, image, description, price } = req.body;
    const author = {
        id: req.user._id,
        username: req.user.username
    };

    const newCampground = { name, image, description, price, author };

    try {
        const newlyCreated = await CampgroundService.createCampground(newCampground);
        console.log(newlyCreated);
        if (!newlyCreated) throw new Error('Creating campground has failed.');
        req.flash('success', 'Campground has been created successfully.');
    } catch (err) {
        req.flash('error', err.message);
    } finally {
        res.redirect('/campgrounds');
    }
});

router.get('/new', AuthService.isLoggedIn, (req, res) => {
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
router.get('/:id/edit', AuthService.checkCampgroundOwnership, (req, res) => {
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
router.delete('/:id', AuthService.checkCampgroundOwnership, async (req, res) => {
    await deleteCampground(req.params.id, () => {
        res.redirect('/campgrounds');
    });
});

export default router;
