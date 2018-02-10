import * as express from 'express';
import * as path from 'path';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as cors from "cors";
import { router as news } from './routes/news';
import { router as employees } from './routes/employees';
import * as functions from 'firebase-functions';
import * as firebase from 'firebase'

export const app = express();

firebase.initializeApp(require('../../firebase.config'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.get('/', (req, res) => {
  res.send('This API Home Page')
});

app.use('/news', news);
app.use('/employees', employees);

exports.api = functions.https.onRequest(express().use('/api', app));