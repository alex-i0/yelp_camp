//                  COMMENTS ROUTES
const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');

//Comment New
router.get('/new', middleware.isLoggedIn, (req, res)=> {
    Campground.findById(req.params.id, (err, campground)=>{
       if(err){
            console.log(err);
       }else{
            res.render('comments/new', {campground: campground});
       } 
    });
});

//Comment Create
router.post('/', middleware.isLoggedIn, (req, res)=> {
    Campground.findById(req.params.id, (err, campground)=> {
        if(err){
            console.log(err);
            redirect('/campgrounds');
        }else{
            Comment.create(req.body.comment, (err, comment)=> {
                if(err){
                    req.flash('error', "Something went wrong");
                    res.redirect('/campgrounds');
                    console.log(err);
                } else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();

                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment);
                    req.flash('success', "Successfully added comment");
                    res.redirect('/campgrounds/'+campground._id);
                }
            });
        }
    });
});

//EDIT

router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res)=> {
    Campground.findById(req.params.id, (err, foundCampground)=> {
        if(err || !foundCampground){
            req.flash('error', "Campground not found");
            res.redirect('back');
        }else{
            Comment.findById(req.params.comment_id, (err, foundComment)=> {
                if(err){
                    console.log(err);
                    res.redirect('back');
                }else{
                    res.render('comments/edit', {campground_id: req.params.id, comment: foundComment });
                }
            });
        }
    });  
});

//UPDATE
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res)=> {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment)=> {
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

//DESTROY

router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res)=> {
    Comment.findByIdAndRemove(req.params.comment_id, (err)=> {
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            req.flash('success', "Comment deleted");
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});


module.exports = router;