import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import User from '../models/user.mjs';

const passportInitialize = (app) => {
    app.use(
        session({
            secret: 'KXhkBWAAmAXBrSsZ',
            resave: false,
            saveUninitialized: false
        })
    );

    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));

    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
};

export default passportInitialize;
