import * as express from 'express';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as cors from "cors";
import { router as news } from './routes/news';
import { router as employees } from './routes/employees';
import { router as posts } from './routes/posts';
import { router as users } from './routes/users';
import * as functions from 'firebase-functions';
import * as firebase from 'firebase-admin';
import * as algoliasearch from 'algoliasearch';

// Initialize app and dependencies
const app = express();
firebase.initializeApp(functions.config().firebase);
const algolia = algoliasearch(
  'JAGNN9QV1Z', // functions.config().algolia.app,
  '23a58b75df085d3635a653ba0b54c27f' // functions.config().algolia.key
);
const index = algolia.initIndex('posts');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.get('/', (req, res) => {
  res.send('This API Home Page')
});

app.use('/news', news);
app.use('/employees', employees);
app.use('/posts', posts);
app.use('/users', users);


// Update the search index every time a blog post is written.
exports.postCreated = functions.firestore.document('/posts/{postId}').onCreate(event => {
  // Get the note document
  const post = event.data.data();

  // Add an 'objectID' field which Algolia requires
  post.objectID = event.params.postId;

  console.log('Saving:', post, 'to Algolia');

  // Write to the algolia index
  return index.saveObject(post);
});

exports.api = functions.https.onRequest(express().use('/api', app));
