import express from 'express';
import passport from 'passport';
import User from '../models/user.mjs';
import log from '../utils/log.mjs';

const router = express.Router();

//Root Route
router.get('/', (req, res) => {
    res.render('landing');
});

//Show Register Route
router.get('/register', (req, res) => {
    res.render('register');
});

//Handle Sign Up Logic
router.post('/register', (req, res) => {
    const newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash('error', err.message);
            log(err.message, 'error');
            return res.render('register');
        }
        passport.authenticate('local')(req, res, () => {
            req.flash('success', 'Welcome to Kanata ' + user.username);
            res.redirect('/campgrounds');
            log('Loged in successfully', 'info');
        });
    });
});

//LOGIN FORM

//show logic form
router.get('/login', (req, res) => {
    res.render('login');
});

//handle login logic
router.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }),
    (req, res) => {}
);

//LOGOUT ROUTE

//logout route
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged you out!');
    res.redirect('/campgrounds');
});

export default router;
