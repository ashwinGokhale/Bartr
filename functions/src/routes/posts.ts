import * as express from 'express';
import * as firebase from 'firebase-admin';
export const router = express.Router();

// Get all posts
router.get("/", async (req, res) => {
	try {
		const resp = await firebase.firestore().collection('/posts').get();
		res.json(resp.docs.map(doc => doc.data()))
	} catch (err) {
		res.status(400).send(err);
	}
});

// Create / update a post
router.post('/', async (req, res) => {
	if (!req.body.title) res.status(400).send('Post must have a title')
	else if (!req.body.title) res.status(400).send('Post must have a picture')
	else if (!req.body.picture) res.status(400).send('Post must have a title')
	else if (!req.body.description) res.status(400).send('Post must have a description')
	else if (!req.body.userId) res.status(400).send('Post must have a user id')
	else if (!req.body._geoloc) res.status(400).send('Post must have a Geo location')
	else {
		try {
			const newPost = await firebase.firestore().collection('/posts').add({
				title: req.body.title,
				picture: req.body.picture,
				description: req.body.description,
				tags: req.body.tags,
				state: 'PENDING',
				userId: req.body.userId,
				createdAt: new Date(),
				lastModified: new Date(),
				_geoloc: req.body._geoloc
			});
			res.status(200).send('Created: ' + JSON.stringify(newPost));	
		} catch (err) {
			res.status(400).send(err);
		}
	}
});
