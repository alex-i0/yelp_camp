import dotenv from 'dotenv';
import mongooseInitialize from './loaders/mongoose.mjs';
import passportInitialize from './loaders/passport.mjs';
import serverInitialize from './loaders/express.mjs';
import apiInitialize from './loaders/api.mjs';
import log from './utils/log.mjs';

dotenv.config();

const PORT = process.env.PORT;

const app = serverInitialize();
mongooseInitialize();
passportInitialize(app);
apiInitialize(app);

app.listen(PORT, process.env.IP, () => {
    log(`Server has started on port ${PORT}`, 'success');
});
