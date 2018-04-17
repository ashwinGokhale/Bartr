"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var cors = require("cors");
var firebase = require("firebase-admin");
var timeout = require("connect-timeout");
var serviceAccount = require('../serviceaccount.json');
var fbConfig = require('../fbconfig.json');
require('dotenv').config('..');
var posts_1 = require("./routes/posts");
var users_1 = require("./routes/users");
var ratings_1 = require("./routes/ratings");
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: fbConfig.databaseURL
});
var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(cors());
app.use(timeout('40s'));
app.get('/', function (req, res) { return res.send('This API Home Page'); });
app.use('/posts', posts_1.router);
app.use('/users', users_1.router);
app.use('/ratings', ratings_1.router);
exports.api = express().use('/api', app);
exports.api.listen(4000, function () { return console.log('Server running on port 4000'); });
//# sourceMappingURL=index.js.map