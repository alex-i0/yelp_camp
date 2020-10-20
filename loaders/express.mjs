import { dirname } from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import flash from 'connect-flash';
import methodOverride from 'method-override';
import express from 'express';
import session from 'express-session';

const serverInitialize = () => {
    const __dirname = dirname(fileURLToPath(import.meta.url));

    const app = express();

    app.use(session({ cookie: { maxAge: 60000 }, secret: 'woot', resave: false, saveUninitialized: false }));

    app.use(bodyParser.urlencoded({ extended: true }));
    app.set('view engine', 'ejs');
    app.use(express.static(__dirname + '/public'));
    app.use(methodOverride('_method'));
    app.use(flash());

    app.use((req, res, next) => {
        const { locals } = res;
        locals.currentUser = req.user;
        locals.error = req.flash('error');
        locals.success = req.flash('success');
        next();
    });

    return app;
};

export default serverInitialize;
