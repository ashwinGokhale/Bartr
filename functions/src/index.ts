import * as express from 'express';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as cors from "cors";
import { router as posts } from './routes/posts';
import { router as users } from './routes/users';
import * as functions from 'firebase-functions';
import * as firebase from 'firebase-admin';
import * as algoliasearch from 'algoliasearch';
const serviceAccount = require('../serviceaccount.json');

// Initialize app and dependencies
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://bartr-b1856.firebaseio.com",
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

app.get('/', (req, res) => res.send('This API Home Page'));

app.use('/posts', posts);
app.use('/users', users);

const handleChange = (index: algoliasearch.AlgoliaIndex, event: functions.Event<functions.firestore.DeltaDocumentSnapshot>) => {
  // Document created/updated
  if (event.data.exists) {
    // Get the post document
    const doc = event.data.data();
    
    // Add an 'objectID' field which Algolia requires
    doc.objectID = event.params.postId;

    console.log('Saving:', doc, 'to Algolia');

    // Write to the algolia postsIndex
    return index.saveObject(doc); 
  }
  // Post deleted
  else {
    console.log('Deleting:', event.params.postId, 'from Algolia');
  
    // Delete post from Algolia
    return index.deleteObject(event.params.postId);
  }
};


// Update the search postsIndex every time a blog post is written
export const postChanged = functions.firestore.document('/posts/{postId}').onWrite(event => handleChange(postsIndex, event));

// Update the search postsIndex every time a blog post is written
export const usersChanged = functions.firestore.document('/users/{userId}').onWrite(event => handleChange(usersIndex, event));



export const api = functions.https.onRequest(express().use('/api', app));
