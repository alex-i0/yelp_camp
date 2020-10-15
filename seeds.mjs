import Campground from './models/campground.mjs';
import Comment from './models/comment.mjs';
import seedData from './data/seedData.mjs';
import log from './utils/log.mjs';

const seedDB = () => {
    //Remove all existing campgrounds from database
    Campground.remove({}, (err) => {
        if (err) {
            log(err, 'error');
        }
        log('Campgrounds have been removed successfully.', 'success');
    });
    //Add campgrounds from defined data
    seedData.forEach((seed) => {
        Campground.create(seed, (campgroundError, campground) => {
            if (campgroundError) {
                log(campgroundError, 'error');
            } else {
                log('Campground has been added successfully.', 'success');

                try {
                    Comment.create({ text: 'This place is great', author: 'Homer' }, (err, comment) => {
                        campground.comments.push(comment);
                        campground.save();
                        log('New comment has been added successfully.', 'success');
                    });
                } catch (err) {
                    log(`Adding comment has failed with error: ${err}`, 'error');
                }
            }
        });
    });
};

export default seedDB;
