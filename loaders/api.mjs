import indexRoutes from '../api/index.mjs';
import campgroundRoutes from '../api/campgrounds.mjs';
import commentRoutes from '../api/comments.mjs';

const apiInitialize = (app) => {
    app.use('/', indexRoutes);
    app.use('/campgrounds', campgroundRoutes);
    app.use('/campgrounds/:id/comments', commentRoutes);
};

export default apiInitialize;
