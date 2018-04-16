import * as express from 'express';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as cors from "cors";
import * as utils from './utils';
import { router as posts } from './routes/posts';
import { router as users } from './routes/users';
import { router as ratings } from './routes/ratings';
import * as functions from 'firebase-functions';
import * as firebase from 'firebase-admin';
import * as algoliasearch from 'algoliasearch';
const serviceAccount = require('../serviceaccount.json');
const fbConfig = require('../fbconfig.json');

// Initialize app and dependencies
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: fbConfig.databaseURL
});

const algolia = algoliasearch(
  functions.config().algolia.app,
  functions.config().algolia.key
);
const postsIndex = algolia.initIndex('posts');
const usersIndex = algolia.initIndex('users');

export const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(function(req, res, next) {
  req.socket.on("error", function(err) {
    console.log('Socket Error:', err);
  });
  req.on('end', (...args) => {
    console.log('Request ended w/ args:', args);
  });
  req.on('close', () => {
    console.log('Request Closed');
  });
  req.on('error', (err) => {
    console.error('Request error:', err);
  });
  res.on('end', (...args) => {
    console.error('Response ended w/ args:', args);
  });
  res.on('close', () => {
    console.log('Response Closed');
  });
  res.on('error', (err) => {
    console.error('Response error:', err);
  });
  next();
});
app.use(function(err,req, res, next) {
  if(err) console.error('Error:', err);
  next();
});

app.get('/', (req, res) => res.send('This API Home Page'));
// app.get('/test', utils.authorized, (req, res) => {
//   res.send('Test works');
// });

app.use('/posts', posts);
app.use('/users', users);
app.use('/ratings', ratings);


const handleChange = (index: algoliasearch.AlgoliaIndex, event: functions.Change<FirebaseFirestore.DocumentSnapshot>, context: functions.EventContext) => {
  // Document created/updated
  if (event.after.exists) {
    // Get the post document
    const doc = event.after.data();
    
    // Add an 'objectID' field which Algolia requires
    doc.objectID = context.params.postId;

    console.log('Saving:', doc, 'to Algolia');

    // Write to the algolia postsIndex
    return index.saveObject(doc); 
  }
  // Post deleted
  else {
    console.log('Deleting:', context.params.postId, 'from Algolia');
  
    // Delete post from Algolia
    return index.deleteObject(context.params.postId);
  }
};


// Update the search postsIndex every time a blog post is written
export const postChanged = functions.firestore.document('/posts/{postId}').onWrite((event, context) => handleChange(postsIndex, event, context));

// Update the search postsIndex every time a blog post is written
export const usersChanged = functions.firestore.document('/users/{userId}').onWrite((event, context) => handleChange(usersIndex, event, context));

export const ratingUpdated = functions.firestore.document('/ratings/{rating}').onWrite(async (event, context) => {
  const [userID, raterID] = context.params.rating.split('_');
  const data = await firebase.firestore().doc(`/users/${userID}`).get();

  console.log('UserID:', userID);
  console.log('RaterID:', raterID);

  const newRating = {};

  // Update rating
  if (event.before.exists) {
    Object.assign(
      newRating,
      {
        totalRatings: data.data().totalRatings+event.after.get('value')-event.before.get('value'),
      }
    );
    console.log('Changing rating to:', newRating);
  }
  // New rating
  else {
    Object.assign(
      newRating,
      {
        totalRatings: data.data().totalRatings+event.after.get('value'),
        numRatings: data.data().numRatings+1,
      }
    );
    console.log('Adding new rating:', newRating);
  }
  return data.ref.set(newRating, {merge: true});
});

export const api = functions.https.onRequest(express().use('/api', app));
