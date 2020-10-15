import Campground from './models/campground.mjs';
import Comment from './models/comment.mjs';
import seedData from './data/seedData.mjs';

const seedDB = () => {
    //Remove all campgrounds
    Campground.remove({}, (err) => {
        if (err) {
            console.log(err);
        }
        console.log('removed campgrounds!');
    });
    //Add a few campgrounds
    seedData.forEach((seed) => {
        Campground.create(seed, (campgroundError, campground) => {
            if (campgroundError) {
                console.log(campgroundError);
            } else {
                console.log('added a campground');

                Comment.create({ text: 'This place is great', author: 'Homer' }, (err, comment) => {
                    if (err) {
                        console.log(err);
                    } else {
                        campground.comments.push(comment);
                        campground.save();
                        console.log('New comment');
                    }
                });
            }
        });
    });
};

export default seedDB;
