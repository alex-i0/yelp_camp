//                  COMMENTS ROUTES
import express from 'express';
import Campground from '../models/campground.mjs';
import Comment from '../models/comment.mjs';
import AuthService from '../services/authService.mjs';
import log from '../utils/log.mjs';

const router = express.Router({ mergeParams: true });

//Comment New
router.get('/new', AuthService.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (campgroundError, campground) => {
        if (campgroundError) {
            console.error(campgroundError);
        } else {
            res.render('comments/new', { campground: campground });
        }
    });
});

//Comment Create
router.post('/', AuthService.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            log(err, 'error');
            redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, (commentError, comment) => {
                if (commentError) {
                    req.flash('error', 'Something went wrong');
                    res.redirect('/campgrounds');
                    log(commentError, 'error');
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();

                    campground.comments.push(comment);
                    campground.save();
                    log(comment, 'info');
                    req.flash('success', 'Successfully added comment');
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

//EDIT

router.get('/:comment_id/edit', AuthService.checkCommentOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err || !foundCampground) {
            req.flash('error', 'Campground not found');
            res.redirect('back');
        } else {
            Comment.findById(req.params.comment_id, (commentError, foundComment) => {
                if (commentError) {
                    log(commentError, 'error');
                    res.redirect('back');
                } else {
                    res.render('comments/edit', { campground_id: req.params.id, comment: foundComment });
                }
            });
        }
    });
});

//UPDATE
router.put('/:comment_id', AuthService.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if (err) {
            log(err, 'error');
            res.redirect('back');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

//DESTROY

router.delete('/:comment_id', AuthService.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            log(err, 'error');
            res.redirect('back');
        } else {
            req.flash('success', 'Comment deleted');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

export default router;
