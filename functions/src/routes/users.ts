import * as express from 'express';
import * as firebase from 'firebase-admin';
import * as bodyParser from 'body-parser';
export const router = express.Router();

// Get all users
router.get("/", async (req, res) => {
	const userToken: string = req.headers.token as string;
	if (userToken) {
		try {
			const tok = await firebase.auth().verifyIdToken(userToken, true)
			const userDocs = await firebase.firestore().collection('/users').get()
			res.json(userDocs.docs.map(doc => doc.data()))
		} catch (error) {
			res.status(400).send(error);
		}
	}
	else 
		res.status(401).send('Unauthorized')
});

router.get('/:uid', async (req, res) => {
	const userToken: string = req.headers.token as string;
	if (userToken) {
		try {
			const tok = await firebase.auth().verifyIdToken(userToken, true)
			const userSnap = await firebase.firestore().doc(`/users/${req.params.uid}`).get()
			res.json(userSnap.data())
		} catch (error) {
			res.status(400).send(error);
		}
	}
	else 
		res.status(401).send('Unauthorized')
})


// Create / update a post
router.post('/:uid', (req, res) => {
	firebase.firestore().doc(`/users/${req.params.uid}`).get()
		.then(data => {
			// Create new user
			if (!data.exists) {
				if (!req.params.uid) res.status(400).send('User must have a uid')
				else if (!req.body.photoUrl) res.status(400).send('User must have a photo url')
				else if (!req.body.email) res.status(400).send('User must have a description')
				else if (!req.body.displayName) res.status(400).send('User must have a display name')
				else {
					data.ref.set({
						uid: req.params.uid,
						photoUrl: req.body.photoUrl,
						displayName: req.body.displayName,
						contactInfo: {
							address: req.body.address || '',
							email: req.body.email,
							phoneNumber: req.body.phoneNumber || ''
						},
						_geoloc: req.body._geoloc || { lat: 0, lng: 0 },
						radius: 5
					})
					.then(newUser => res.status(200).send(`User: ${req.params.uid} created at: ${newUser.writeTime}`))
					.catch(error => res.status(400).send(error))
				}
			}
			
			// Update a user
			else {
				const originalUser = data.data()
				data.ref.set({
					photoUrl: req.body.photoUrl || originalUser.photoUrl,
					displayName: req.body.displayName || originalUser.displayName,
					contactInfo: {
						address: req.body.address || originalUser.contactInfo.address,
						email: req.body.email || originalUser.contactInfo.email,
						phoneNumber: req.body.phoneNumber || originalUser.contactInfo.phoneNumber
					},
					_geoloc: req.body._geoloc || originalUser._geoloc,
					radius: (req.body.radius && req.body.radius >= 5) ? req.body.radius : originalUser.radius
				}, { merge: true })
				.then(newUser => res.status(200).send(`User: ${req.params.uid} created at: ${newUser.writeTime}`))
				.catch(error => res.status(400).send(error))
			}
		})
});

router.delete('/:uid', async (req, res) => {
	const userToken: string = req.headers.token as string;
	if (userToken) {
		try {
			const tok = await firebase.auth().verifyIdToken(userToken, true)
			if (tok.uid === req.params.uid) {
				const userSnap = await firebase.firestore().doc(`/users/${req.params.uid}`).get()
				res.json(userSnap.data())
			}
			else
				res.status(401).send('Unauthorized')
		} catch (error) {
			res.status(400).send(error);
		}
	}
	else 
		res.status(401).send('Unauthorized')
})