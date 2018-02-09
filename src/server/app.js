import express from 'express'
import path from 'path';
// import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from "cors";
import { router as index } from './routes/index';
import { router as api } from './routes/api';
export const firebase = require('firebase');

export const app = express();
var config = {
  apiKey: "AIzaSyDBETqIADd-E75bR2lSbS-VuqP5-RD1U4Q",
  authDomain: "bartr-b1856.firebaseapp.com",
  databaseURL: "https://bartr-b1856.firebaseio.com",
  projectId: "bartr-b1856",
  storageBucket: "bartr-b1856.appspot.com",
  messagingSenderId: "952082363953"
};

firebase.initializeApp(config);

app.use(express.static("public"));
// app.use(favicon(path.resolve(__dirname+'/../../public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use('/api', api);
app.use('/', index);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});