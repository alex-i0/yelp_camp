import express from 'express';
import bodyParser from 'body-parser';
import flash from 'connect-flash';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import methodOverride from 'method-override';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import dotenv from 'dotenv';

import User from './models/user.mjs';
import seedDB from './seeds.mjs';
import log from './utils/log.mjs';

import campgroundRoutes from './routes/campgrounds.mjs';
import commentRoutes from './routes/comments.mjs';
import indexRoutes from './routes/index.mjs';
import mongooseInitialize from './config/db.mjs';

dotenv.config();
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT || 4444;
mongooseInitialize();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

if (process.env.SEED) seedDB();

//PASSPORT CONFIGURATION
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

app.use((req, res, next) => {
    const { locals } = res;
    locals.currentUser = req.user;
    locals.error = req.flash('error');
    locals.success = req.flash('success');
    next();
});

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(PORT, process.env.IP, () => {
    log(`Server has started on port ${PORT}`, 'success');
});
