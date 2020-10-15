import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const UserSchema = new mongoose.Schema({
    user: String,
    password: String
});

UserSchema.plugin(passportLocalMongoose);

export default mongoose.model('User', UserSchema);
