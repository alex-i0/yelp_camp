import express from 'express';
import bodyParser from 'body-parser';
import flash from 'connect-flash';
import methodOverride from 'method-override';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import seedDB from './seeds.mjs';
import log from './utils/log.mjs';

import campgroundRoutes from './routes/campgrounds.mjs';
import commentRoutes from './routes/comments.mjs';
import indexRoutes from './routes/index.mjs';
import mongooseInitialize from './config/db.mjs';
import passportInitialize from './config/passport.mjs';

dotenv.config();
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT || 4444;
mongooseInitialize();
passportInitialize(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

if (process.env.SEED) seedDB();

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
