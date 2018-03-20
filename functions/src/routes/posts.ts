import * as express from 'express';
import * as functions from 'firebase-functions';
import * as firebase from 'firebase-admin';
import * as algoliasearch from 'algoliasearch';
import * as googleStorage from '@google-cloud/storage';
import * as Multer from 'multer';
import * as gmaps from '@google/maps'
export const router = express.Router();

const algolia = algoliasearch(
	'JAGNN9QV1Z', // functions.config().algolia.app,
	'23a58b75df085d3635a653ba0b54c27f' // functions.config().algolia.key
);

var googleMapsClient = gmaps.createClient({
	key: 'AIzaSyCS0wuKGReGQWSfs-YZY-YTdMpyvLgU5Ss'
});

const postsIndex = algolia.initIndex('posts');

const storage = googleStorage({
	projectId: functions.config().firebase.projectId,
	keyFilename: '../serviceaccount.json'
});
  
const bucket = storage.bucket(functions.config().firebase.storageBucket);

const multer = Multer({
	storage: Multer.memoryStorage(),
	limits: {
		fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
	}
});

// Get post by id
router.get("/geo", async (req, res) => {
	const userToken: string = req.headers.token as string;
	
	if (!req.query.radius) res.status(400).send('Query must have a Radius')
	else if (isNaN(req.query.radius)) res.status(400).send('Radius must be a number')
	else if (!req.query.lat) res.status(400).send('Query must have a Latitude')
	else if (isNaN(req.query.lat)) res.status(400).send('Latitude must be a number')
	else if (!req.query.lng) res.status(400).send('Query must have a Longitude')
	else if (isNaN(req.query.lng)) res.status(400).send('Longitude must be a number')
	else if (!userToken) res.status(401).send('Unauthorized')
	else {
		try {
			const tok = await firebase.auth().verifyIdToken(userToken, true)
			const posts = await postsIndex.search({
				aroundLatLng: `${req.query.lat}, ${req.query.lng}`,
				aroundRadius: req.query.radius
			})
			res.json(posts.hits);
		} catch (error) {
			res.status(400).send(error);
		}
	}
});

// Get all posts by user
router.get('/user/:uid', async (req, res) =>  {
	const userToken: string = req.headers.token as string;
	if (userToken) {
		try {
			const tok = await firebase.auth().verifyIdToken(userToken, true)
			const resp = await firebase.firestore().collection('/posts').where('userId', '==', req.params.uid).get()
			res.json(resp.docs.map(doc => doc.data()))
		} catch (error) {
			res.status(400).send(error);
		}
	}
	else 
		res.status(401).send('Unauthorized')
})

// Get all posts
router.get("/", async (req, res) => {
	const userToken: string = req.headers.token as string;
	if (userToken) {
		try {
			const tok = await firebase.auth().verifyIdToken(userToken, true)
			const resp = await firebase.firestore().collection('/posts').get();
			res.json(resp.docs.map(doc => doc.data()))
		} catch (error) {
			res.status(400).send(error);
		}
	}
	else 
		res.status(401).send('Unauthorized')
});

// Create / update a post
router.post('/', async (req, res) => {
	const userToken: string = req.headers.token as string;
	if (!req.body.title) res.status(400).send('Post must have a title')
	else if (!req.body.photos) res.status(400).send('Post must have a picture')
	else if (!req.body.description) res.status(400).send('Post must have a description')
	else if (!req.body._geoloc) res.status(400).send('Post must have a Geo location')
	else if (!userToken) res.status(401).send('Unauthorized')
	else {
		try {
			const tok = await firebase.auth().verifyIdToken(userToken);
			const newPost = await firebase.firestore().collection('/posts').add({
				title: req.body.title,
				picture: req.body.picture,
				description: req.body.description,
				tags: req.body.tags,
				state: 'PENDING',
				userId: tok.uid,
				createdAt: new Date(),
				lastModified: new Date(),
				_geoloc: req.body._geoloc
			})
			res.status(200).send('Created: ' + newPost.id);
		} catch (err) {
			console.error('Error:', err);
			res.status(400).send(err);
		}
	}
});

// Get post by id
router.get('/:postId', async (req, res) => {
	const userToken: string = req.headers.token as string;
	if (userToken) {
		try {
			const tok = await firebase.auth().verifyIdToken(userToken, true)
			const postSnap = await firebase.firestore().doc(`/posts/${req.params.postId}`).get()
			res.json(postSnap.data())
		} catch (error) {
			res.status(400).send(error);
		}
	}
	else 
		res.status(401).send('Unauthorized')
})

// Delete post by id
router.delete('/:postId', async (req, res) => {
	const userToken: string = req.headers.token as string;
	if (userToken) {
		try {
			const tok = await firebase.auth().verifyIdToken(userToken, true)
			const val = await firebase.firestore().doc(`/posts/${req.params.postId}`).delete()
			res.send('Delete succeeded')
		} catch (error) {
			res.status(400).send(error);
		}
	}
	else 
		res.status(401).send('Unauthorized')
})

router.post('/test', multer.any(), async (req, res) => {
	console.log(functions.config());
	console.log('Body:', req.body);
	if (req.body.address) {
		googleMapsClient.geocode({address: req.body.address}, (err, response) => {
			if (!err) {
			  console.log(response.json.results[0].geometry.location);
			}
			else 
				console.error(err);
		});
	}
	res.send('good')
})