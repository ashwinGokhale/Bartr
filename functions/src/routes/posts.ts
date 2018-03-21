import * as express from 'express';
import * as functions from 'firebase-functions';
import * as firebase from 'firebase-admin';
import * as algoliasearch from 'algoliasearch';
import * as googleStorage from '@google-cloud/storage';
import * as Multer from 'multer';
import axios from 'axios';
import { uploadImageToStorage } from '../utils';
export const router = express.Router();

const algolia = algoliasearch(
	functions.config().algolia.app,
	functions.config().algolia.key
);

const postsIndex = algolia.initIndex('posts');

// const storage = googleStorage({
// 	projectId: functions.config().firebase.projectId,
// 	keyFilename: '../serviceaccount.json'
// });
  
// const bucket = storage.bucket(functions.config().firebase.storageBucket);

const multer = Multer({
	storage: Multer.memoryStorage(),
	limits: {
		fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
	}
});

// Get post by id
router.get("/geo", async (req, res) => {
	const userToken: string = req.headers.token as string;
	
	if (!req.query.radius) res.status(400).send('Query must have a Radius');
	else if (isNaN(req.query.radius)) res.status(400).send('Radius must be a number');
	else if (!req.query.lat) res.status(400).send('Query must have a Latitude');
	else if (isNaN(req.query.lat)) res.status(400).send('Latitude must be a number');
	else if (!req.query.lng) res.status(400).send('Query must have a Longitude');
	else if (isNaN(req.query.lng)) res.status(400).send('Longitude must be a number');
	else if (!userToken) res.status(401).send('Unauthorized');
	else {
		try {
			const tok = await firebase.auth().verifyIdToken(userToken, true);
			const posts = await postsIndex.search({
				aroundLatLng: `${req.query.lat}, ${req.query.lng}`,
				aroundRadius: req.query.radius
			});
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
			const tok = await firebase.auth().verifyIdToken(userToken, true);
			const resp = await firebase.firestore().collection('/posts').where('userId', '==', req.params.uid).get();
			res.json(resp.docs.map(doc => doc.data()));
		} catch (error) {
			res.status(400).send(error);
		}
	}
	else 
		res.status(401).send('Unauthorized');
});

// Get all posts
router.get("/", async (req, res) => {
	const userToken: string = req.headers.token as string;
	if (userToken) {
		try {
			const tok = await firebase.auth().verifyIdToken(userToken, true);
			const resp = await firebase.firestore().collection('/posts').get();
			res.json(resp.docs.map(doc => doc.data()));
		} catch (error) {
			res.status(400).send(error);
		}
	}
	else 
		res.status(401).send('Unauthorized');
});

// Create / update a post
router.post('/', async (req, res) => {
	const userToken: string = req.headers.token as string;
	if (!req.body.title) res.status(400).send('Post must have a title');
	else if (!req.body.photos) res.status(400).send('Post must have a picture');
	else if (!req.body.description) res.status(400).send('Post must have a description');
	else if (!req.body._geoloc && !req.body.address) res.status(400).send('Post must have a Geo location or Address');
	else if (!userToken) res.status(401).send('Unauthorized');
	else {
		try {
			const tok = await firebase.auth().verifyIdToken(userToken, true);
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
			});
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
			const tok = await firebase.auth().verifyIdToken(userToken, true);
			const postSnap = await firebase.firestore().doc(`/posts/${req.params.postId}`).get();
			res.json(postSnap.data());
		} catch (error) {
			res.status(400).send(error);
		}
	}
	else 
		res.status(401).send('Unauthorized');
});

// Delete post by id
router.delete('/:postId', async (req, res) => {
	const userToken: string = req.headers.token as string;
	if (userToken) {
		try {
			const tok = await firebase.auth().verifyIdToken(userToken, true);
			const val = await firebase.firestore().doc(`/posts/${req.params.postId}`).delete();
			res.send('Delete succeeded');
		} catch (error) {
			res.status(400).send(error);
		}
	}
	else 
		res.status(401).send('Unauthorized');
});

router.post('/test', multer.array('photos', 12), async (req, res, next) => {
	const files = req.files as Express.Multer.File[];
	const userToken: string = req.headers.token as string;
	if (!req.body.title) return res.status(400).send('Post must have a title');
	else if (!files.length) return res.status(400).send('Post must have a picture');
	else if (!req.body.description) return res.status(400).send('Post must have a description');
	else if (!req.body._geoloc && !req.body.address) return res.status(400).send('Post must have a Geo location or Address');
	else if (!userToken) return res.status(401).send('Unauthorized');
	try {
		const tok = await firebase.auth().verifyIdToken(userToken, true);
		const newPostRef = await firebase.firestore().collection('/posts').doc();
		const photoUrls = await Promise.all(files.map((file: Express.Multer.File) => uploadImageToStorage(file, newPostRef.id)));
		let lat = req.body.lat;
		let lng = req.body.lng;
		if (req.body.address) {
			const { data } = await axios.get(
				'https://maps.googleapis.com/maps/api/geocode/json',
				{
					params: {
						address: req.body.address,
						key: functions.config().gmaps.key
					}
				}
			);
			if (!data.results.length) return res.status(400).send('Invalid address: ' + req.body.address);
			
			lat = data.results[0].geometry.location.lat;
			lng = data.results[0].geometry.location.lng;
		}

		const postBuilder = {};
		// Build properties of user to update
		Object.assign(
			postBuilder,
			{ photoUrls },
			{ title: req.body.title },

			{ description: req.body.description },
			{ tags: req.body.tags ? req.body.tags : req.body.title },
			{ state: 'PENDING' },
			{ postId: newPostRef.id },
			{ userId: tok.uid }, 
			{ createdAt: new Date() },
			{ lastModified: new Date() },

			{ _geoloc: {lat, lng} }
			
		);

		const newPost = await newPostRef.set(postBuilder);
		return res.status(200).send('Created post: ' + newPostRef.id + ' at ' + newPost.writeTime);		
	} catch (err) {
		console.error('Error:', err);
		return res.status(400).send(err);
	}
});