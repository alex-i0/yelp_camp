import Campground from '../models/campground.mjs';
import Comment from '../models/comment.mjs';
import log from '../utils/log.mjs';

const middlewareObj = {};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
    try {
        if (!req.isAuthenticated()) req.flash('error', 'You need to be logged in to do that');

        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err) throw new Error('Campground not found');
            if (!foundCampground.author.id.equals(req.user._id)) throw new Error("You don't have premission to do that");

            next();
        });
    } catch (errorMessage) {
        req.flash('error', errorMessage);
        res.redirect('back');
        log(errorMessage, 'error');
    }
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
    try {
        if (!req.isAuthenticated()) throw new Error('You need to be logged in to do that');
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err || !foundComment) throw new Error('Comment not found');
            if (!foundComment.author.id.equals(req.user._id)) throw new Error("You don't have premission to do that");

            next();
        });
    } catch (errorMessage) {
        req.flash('error', errorMessage);
        res.redirect('back');
        log(errorMessage, 'error');
    }
};

middlewareObj.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You need to be logged in to do that');
        res.redirect('/login');
        log('You need to be logged in to do this acction.', 'info');

        return null;
    }

    return next();
};

export default middlewareObj;
