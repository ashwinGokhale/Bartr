import * as express from 'express';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as cors from "cors";
import * as firebase from 'firebase-admin';
import * as timeout from 'connect-timeout';
const serviceAccount = require('../serviceaccount.json');
const fbConfig = require('../fbconfig.json');
require('dotenv').config('..');
import * as utils from './utils';
import { router as posts } from './routes/posts';
import { router as users } from './routes/users';
import { router as ratings } from './routes/ratings';
import { router as trades } from './routes/trades';

// Initialize app and dependencies
// firebase.initializeApp({
// 	credential: firebase.credential.cert(serviceAccount),
// 	databaseURL: fbConfig.databaseURL
// });

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cookieParser());
app.use(cors());
app.use(timeout('40s'));
app.use(utils.authorized);

app.get('/', (req, res) => res.send('This API Home Page'));

app.use('/posts', posts);
app.use('/users', users);
app.use('/ratings', ratings);
app.use('/trades', trades);

export const api = express().use('/api', app);

api.listen(4000, () => console.log('Server running on port 4000'));