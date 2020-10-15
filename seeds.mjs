import Campground from './models/campground.mjs';
import Comment from './models/comment.mjs';

const data = [
    {
        name: 'Mountain Creek',
        image: 'https://rainyadventures.com/wp-content/uploads/2017/05/Yosemite-National-Park-Little-Known-Best-Yosemite-Campground.jpg',
        description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet hic, enim cupiditate eos sequi voluptate minima neque necessitatibus repellendus et accusantium fuga nisi odit dicta? Vitae officia eaque nulla labore?'
    },

    {
        name: 'Golden Vally',
        image: 'https://incadventures.com/wp-content/uploads/2013/09/Campsite-e1379007508147.jpg',
        description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet hic, enim cupiditate eos sequi voluptate minima neque necessitatibus repellendus et accusantium fuga nisi odit dicta? Vitae officia eaque nulla labore?'
    },

    {
        name: 'Rocky Hills',
        image: 'https://econistas.com/wp-content/uploads/2018/02/Yosemite-1-1.jpg',
        description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet hic, enim cupiditate eos sequi voluptate minima neque necessitatibus repellendus et accusantium fuga nisi odit dicta? Vitae officia eaque nulla labore?'
    }
];

function seedDB() {
    //Remove all campgrounds
    Campground.remove({}, (err) => {
        if (err) {
            console.log(err);
        }
        console.log('removed campgrounds!');
    });
    //Add a few campgrounds
    data.forEach((seed) => {
        Campground.create(seed, (err, campground) => {
            if (err) {
                console.log(err);
            } else {
                console.log('added a campground');

                Comment.create({ text: 'This place is great', author: 'Homer' }, (err, comment) => {
                    if (err) {
                        console.log(err);
                    } else {
                        if (err) {
                            console.log(err);
                        } else {
                            campground.comments.push(comment);
                            campground.save();
                            console.log('New comment');
                        }
                    }
                });
            }
        });
    });
}

export default seedDB;
