import * as express from 'express';
import * as functions from 'firebase-functions';
import * as firebase from 'firebase-admin';
import * as algoliasearch from 'algoliasearch';
import * as Multer from 'multer';
import axios from 'axios';
import * as utils from '../utils';
export const router = express.Router();

const algolia = algoliasearch(
	// functions.config().algolia.app,
	process.env.ALGOLIA_APP,
	// functions.config().algolia.key
	process.env.ALGOLIA_KEY,
);

const postsIndex = algolia.initIndex('posts');

postsIndex.setSettings({
	attributesForFaceting: ['state']
})

const multer = Multer({
	storage: Multer.memoryStorage(),
	limits: {
		fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
	}
});

// Get post by id
router.get("/geo", async (req: utils.Req, res: utils.Res) => {
	if (!req.query.radius) return utils.errorRes(res, 400, 'Query must have a Radius');
	if (isNaN(req.query.radius)) return utils.errorRes(res, 400, 'Radius must be a number');
	if (!req.query.lat) return utils.errorRes(res, 400, 'Query must have a Latitude');
	if (isNaN(req.query.lat)) return utils.errorRes(res, 400, 'Latitude must be a number');
	if (!req.query.lng) return utils.errorRes(res, 400, 'Query must have a Longitude');
	if (isNaN(req.query.lng)) return utils.errorRes(res, 400, 'Longitude must be a number');
	try {
		const posts = await postsIndex.search({
			aroundLatLng: `${req.query.lat}, ${req.query.lng}`,
			aroundRadius: req.query.radius,
			filters: 'state:"OPEN"'
		});
		return utils.successRes(res, posts.hits);
	} catch (error) {
		console.error('Error:', error);
		return utils.errorRes(res, 400, error);
	}
});

// Get all posts by user
router.get('/user/:uid', async (req: utils.Req, res: utils.Res) =>  {
	try {
		let query = firebase.firestore().collection('/posts').where('userId', '==', req.params.uid);
		if (req.token.uid !== req.params.uid) query = query.where('state', '==', 'OPEN');
		const resp = await query.get();
		const data = resp.docs.map(doc => doc.data());
		// console.log('User Posts:', data);
		return utils.successRes(res, data);
	} catch (error) {
		console.error('Error:', error);
		return utils.errorRes(res, 400, error);
	}
});

// Get all posts
router.get("/", async (req: utils.Req, res: utils.Res) => {
	try {
		const resp = await firebase.firestore().collection('/posts').where('state', '==', 'OPEN').get();
		return utils.successRes(res, resp.docs.map(doc => doc.data()));
	} catch (error) {
		console.error('Error:', error);
		return utils.errorRes(res, 400, error);
	}
});

// Get post by id
router.get('/:postId', async (req: utils.Req, res: utils.Res) => {
	try {
		const postSnap = await firebase.firestore().doc(`/posts/${req.params.postId}`).get();
		return utils.successRes(res, postSnap.data());
	} catch (error) {
		console.error('Error:', error);
		return utils.errorRes(res, 400, error);
	}
});

// Delete post by id
router.delete('/:postId', async (req: utils.Req, res: utils.Res) => {
	try {
		const tok = req.token;
		const post = await firebase.firestore().doc(`/posts/${req.params.postId}`).get();
		console.log('Deleting post:', post.data());
		console.log(`Post User: ${post.data().userId}\tReq User: ${req.token.uid}`);
		if (post.data().userId !== tok.uid) return utils.errorRes(res, 401, 'Unauthorized');
		const val = await firebase.firestore().doc(`/posts/${req.params.postId}`).delete();
		const err = await utils.deletePostfromStorage(req.params.postId);
		return utils.successRes(res, post.data());
	} catch (error) {
		console.error('Error:', error);
		return utils.errorRes(res, 400, error);
	}
});


// Create post route
router.put('/:postId', multer.array('photos', 12), utils.authorized, async (req: utils.Req, res: utils.Res, next) => {
	const files: Express.Multer.File[] = req.files ? (req.files as Express.Multer.File[]) : Array<Express.Multer.File>();
	if (req.body.tags && !Array.isArray(req.body.tags)) req.body.tags = JSON.parse(req.body.tags);
	try {
		const postRef = await firebase.firestore().doc(`/posts/${req.params.postId}`);
		const postData = await postRef.get();
		if (!postData.exists) return utils.errorRes(res, 400, 'Post does not exist');
		if (postData.data().userId !== req.token.uid) return utils.errorRes(res, 401, "Cannot modify other user's posts");
		let lat = parseInt(req.body.lat, 10);
		let lng = parseInt(req.body.lng, 10);
		if (req.body.address) {
			const { data } = await axios.get(
				'https://maps.googleapis.com/maps/api/geocode/json',
				{
					params: {
						address: req.body.address,
						// key: functions.config().gmaps.key
						key: process.env.GMAPS_KEY
					}
				}
			);
			if (!data.results.length) return utils.errorRes(res, 400, 'Invalid address: ' + req.body.address);
			
			lat = data.results[0].geometry.location.lat;
			lng = data.results[0].geometry.location.lng;
		}

		const photoUrls = await Promise.all(files.map((file: Express.Multer.File) => utils.uploadImageToStorage(file, postRef.id)));

		const postBuilder = {};
		const geoBuilder = {};
		
		// Build properties of post to update
		Object.assign(
			postBuilder,
			{ photoUrls: [ ...Object.values(postData.data().photoUrls), ...photoUrls]},
			req.body.title && { title: req.body.title },
			req.body.description && { description: req.body.description },
			(req.body.tags || req.body.title) && { tags: req.body.tags ? req.body.tags : req.body.title },
			req.body.type && { type: req.body.type },
			{ lastModified: new Date() },
		);

		Object.assign(
			geoBuilder,
			lat && {lat},
			lng && {lng}
		);

		if (Object.keys(geoBuilder)) Object.assign(postBuilder, {_geoloc : geoBuilder});

		await postRef.set(postBuilder, {merge: true});
		return utils.successRes(res, (await postRef.get()).data());
	} catch (err) {
		console.error('Error:', err);
		return utils.errorRes(res, 400, err);
	}

});


// Create post route
router.post('/', multer.array('photos', 12), async (req: utils.Req, res: utils.Res, next) => {
	const files = req.files as Express.Multer.File[];
	if (!req.body.title) return utils.errorRes(res, 400, 'Post must have a title');
	if (!files || !files.length) return utils.errorRes(res, 400, 'Post must have a picture');
	if (!req.body.description) return utils.errorRes(res, 400, 'Post must have a description');
	if (!req.body.type) return utils.errorRes(res, 400, 'Post must have a type');
	if (req.body.type !== 'good' && req.body.type !== 'service') return utils.errorRes(res, 400, 'Invalid post type: ' + req.body.type);
	if (!req.body.lat && !req.body.lng && !req.body.address) return utils.errorRes(res, 400, 'Post must have a Geo location or Address');
	if(!Array.isArray(req.body.tags))
		req.body.tags = JSON.parse(req.body.tags);

	// console.log('Post body:', req.body);
	try {
		// const tok = await utils.getIDToken(req.headers.token);
		// if (!tok) return utils.errorRes(res, 401, 'Invalid token');
		const tok = req.token;
		let lat = parseInt(req.body.lat, 10);
		let lng = parseInt(req.body.lng, 10);
		let address = req.body.address;
		// Given address, get lat and lng
		if (address) {
			const { data } = await axios.get(
				'https://maps.googleapis.com/maps/api/geocode/json',
				{
					params: {
						address: req.body.address,
						// key: functions.config().gmaps.key
						key: process.env.GMAPS_KEY
					}
				}
			);
			if (!data.results.length) return utils.errorRes(res, 400, 'Invalid address: ' + address);
			
			lat = data.results[0].geometry.location.lat;
			lng = data.results[0].geometry.location.lng;
		}
		// Given lat and lng, get address
		else {
			const { data } = await axios.get(
				'https://maps.googleapis.com/maps/api/geocode/json',
				{
					params: {
						latlng: `${lat},${lng}`,
						// key: functions.config().gmaps.key
						key: process.env.GMAPS_KEY
					}
				}
			);
			if (!data.results.length) return utils.errorRes(res, 400, 'Invalid latitude and longitude: ' + lat + ', ' + lng);
			
			address = data.results[0].formatted_address;
		}

		if (!lat) return utils.errorRes(res, 400, 'Invalid Latitude: ' + req.body.lat);
		if (!lng) return utils.errorRes(res, 400, 'Invalid Longitude: ' + req.body.lng);

		const newPostRef = await firebase.firestore().collection('/posts').doc();
		const photoUrls = await Promise.all(files.map((file: Express.Multer.File) => utils.uploadImageToStorage(file, newPostRef.id)));
		const userSnap = await firebase.firestore().doc(`/users/${tok.uid}`).get();

		const postBuilder = {};
		// Build properties of user to update
		Object.assign(
			postBuilder,
			{ photoUrls },
			{ title: req.body.title },
			{ description: req.body.description },
			{ tags: req.body.tags ? req.body.tags : req.body.title },
			{ type: req.body.type },
			{ state: 'OPEN' },
			{ postId: newPostRef.id },
			{ userId: tok.uid },
			{ displayName: userSnap.data().displayName },
			{ createdAt: new Date() },
			{ lastModified: new Date() },
			{ address },
			{ _geoloc: { lat, lng } }
		);

		await newPostRef.set(postBuilder);
		return utils.successRes(res, postBuilder);
	} catch (err) {
		console.error('Error:', err);
		return utils.errorRes(res, 400, err);
	}
});
