import * as express from 'express';
import * as functions from 'firebase-functions';
import * as firebase from 'firebase-admin';
import * as algoliasearch from 'algoliasearch';
import * as Multer from 'multer';
import axios from 'axios';
import * as utils from '../utils';
export const router = express.Router();

const algolia = algoliasearch(
	functions.config().algolia.app,
	functions.config().algolia.key
);

const postsIndex = algolia.initIndex('posts');

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

router.get('/test', async (req, res) => {
	console.log('Headers:', req.headers);
	res.send('good');
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
			const post = await firebase.firestore().doc(`/posts/${req.params.postId}`).get();
			if (post.data().userId !== tok.uid)
				res.status(401).send('Unauthorized');
			else {
				const val = await firebase.firestore().doc(`/posts/${req.params.postId}`).delete();
				const err = await utils.deletePostfromStorage(req.params.postId);
				
				res.status(200).send(`Post: ${req.params.postId} deleted at: ${val.writeTime}`);
			}
		} catch (error) {
			res.status(400).send(error);
		}
	}
	else 
		res.status(401).send('Unauthorized');
});

// Create post route
router.post('/', multer.array('photos', 12), async (req, res, next) => {
	const files = req.files as Express.Multer.File[];
	const userToken: string = req.headers.token as string;
	if (!req.body.title) return utils.errorRes(res, 400, 'Post must have a title');
	else if (!files.length) return utils.errorRes(res, 400, 'Post must have a picture');
	else if (!req.body.description) return utils.errorRes(res, 400, 'Post must have a description');
	else if (!req.body.type) return utils.errorRes(res, 400, 'Post must have a type');
	else if (req.body.type !== 'good' && req.body.type !== 'service') return utils.errorRes(res, 400, 'Invalid post type: ' + req.body.type);
	else if (!req.body.lat && !req.body.lng && !req.body.address) return utils.errorRes(res, 400, 'Post must have a Geo location or Address');
	else if (!userToken) return utils.errorRes(res, 401, 'Unauthorized');
	console.log('Test body:', req.body);
	
	try {
		const tok = await utils.getIDToken(userToken);
		if (!tok) return utils.errorRes(res, 401, 'Invalid token');
		let lat = parseInt(req.body.lat, 10);
		let lng = parseInt(req.body.lng, 10);
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
			if (!data.results.length) return utils.errorRes(res, 400, 'Invalid address: ' + req.body.address);
			
			lat = data.results[0].geometry.location.lat;
			lng = data.results[0].geometry.location.lng;
		}

		if (!lat) return utils.errorRes(res, 400, 'Invalid Latitude: ' + req.body.lat);
		if (!lng) return utils.errorRes(res, 400, 'Invalid Longitude: ' + req.body.lng);

		const newPostRef = await firebase.firestore().collection('/posts').doc();
		const photoUrls = await Promise.all(files.map((file: Express.Multer.File) => utils.uploadImageToStorage(file, newPostRef.id)));

		const postBuilder = {};
		// Build properties of user to update
		Object.assign(
			postBuilder,
			{ photoUrls },
			{ title: req.body.title },
			{ description: req.body.description },
			{ tags: JSON.parse(req.body.tags) ? JSON.parse(req.body.tags) : req.body.title },
			{ state: 'PENDING' },
			{ postId: newPostRef.id },
			{ userId: tok.uid }, 
			{ createdAt: new Date() },
			{ lastModified: new Date() },
			{ _geoloc: { lat, lng } }
		);

		await newPostRef.set(postBuilder);
		return utils.successRes(res, postBuilder);
	} catch (err) {
		console.error('Error:', err);
		return utils.errorRes(res, 400, err);
	}
});
