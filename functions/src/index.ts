import * as functions from 'firebase-functions';
import * as firebase from 'firebase';
import * as express from 'express';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';

const app = express();

// React App
const ServerApp = React.createFactory(require('../build/server.bundle.js').default);
const template = require('./template');

// Server-side Data Loading
const appConfig = functions.config().firebase;
const database = require('./firebase-database');
database.initializeApp(appConfig);

// Helper function to get the markup from React, inject the initial state, and
// send the server-side markup to the client
const renderApplication = (url, res, initialState) => {
  const html = ReactDOMServer.renderToString(ServerApp({url: url, context: {}, initialState, appConfig}));
  const templatedHtml = template({body: html, initialState: JSON.stringify(initialState)});
  res.send(templatedHtml);
};

app.get('/favicon.ico', function(req, res) {
  res.send(204);
});

app.get('/:userId?', (req, res) => {
  res.set('Cache-Control', 'public, max-age=60, s-maxage=180');
  if (req.params.userId) {
    // client is requesting user-details page with userId
    // load the data for that employee and its direct reports
    database.getEmployeeById(req.params.userId).then(resp => {
      console.log(resp);
      renderApplication(req.url, res, resp);
    });
  } else {
    // index page. load data for all employees
    database.getAllEmployees().then(resp => {
      console.log(resp);
      renderApplication(req.url, res, resp);
    });
  }
});

exports.server = functions.https.onRequest(app);
