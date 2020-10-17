import mongoose from 'mongoose';

const mongooseInitialize = () => {
    const url = process.env.DATABASEURL || 'mongodb://localhost/yelp_camp';
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
    //url = 'mongodb://admin:admin@ds219000.mlab.com:19000/Camp.ca_alex'
};

export default mongooseInitialize;
