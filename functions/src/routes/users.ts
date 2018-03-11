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
router.post('/:uid', async (req, res) => {
	const userToken: string = req.headers.token as string;
	if (userToken) {
		try {
			const tok = await firebase.auth().verifyIdToken(userToken, true)
			if (tok.uid === req.params.uid) {		
				const data = await firebase.firestore().doc(`/users/${req.params.uid}`).get()
				if (!data.exists) {
					if (!req.params.uid) res.status(400).send('User must have a uid')
					else if (!req.body.photoUrl) res.status(400).send('User must have a photo url')
					else if (!req.body.email) res.status(400).send('User must have a description')
					else if (!req.body.displayName) res.status(400).send('User must have a display name')
					else {
						const newUser = await data.ref.set({
							uid: req.params.uid,
							photoUrl: req.body.photoUrl,
							displayName: req.body.displayName,
							contactInfo: {
								address: req.body.address || '',
								email: req.body.email,
								phoneNumber: req.body.phoneNumber || ''
							},
							lat: 0, 
							lng: 0 ,
							radius: 5
						})
						res.status(200).send(`User: ${req.params.uid} created at: ${newUser.writeTime}`)
					}
				}
				else res.status(400).send(`User: ${req.params.uid} already exits`)
			}
			else
				res.status(401).send('Unauthorized')
		} catch (error) {
			res.status(400).send(error);
		}
	}
	else 
		res.status(401).send('Unauthorized')
});

router.put('/:uid', async (req, res) => {
	const userToken: string = req.headers.token as string;
	if (userToken) {
		try {
			const tok = await firebase.auth().verifyIdToken(userToken, true)
			if (tok.uid === req.params.uid) {		
				let userBuilder = {};
				let contactBuilder = {};

				// Build properties of user to update
				Object.assign(
					userBuilder,
					req.body.photoUrl && { photoUrl: req.body.photoUrl },
					req.body.displayName && { displayName: req.body.displayName },
					req.body.lat && { lat: req.body.lat },
					req.body.lng && { lng: req.body.lng },
					req.body.radius && { radius: req.body.radius }
				)
				// Build contact info to update
				Object.assign(
					contactBuilder,
					req.body.contactInfo.address && { address: req.body.contactInfo.address },
					req.body.contactInfo.phoneNumber && { phoneNumber: req.body.contactInfo.phoneNumber },
				)

				if (Object.keys(contactBuilder).length)
					Object.assign(userBuilder, {contactInfo: contactBuilder})

				const userSnap = await firebase.firestore().doc(`/users/${req.params.uid}`).set(
					userBuilder,
					{merge: true}
				)
				res.status(200).send(`User: ${req.params.uid} updated at: ${userSnap.writeTime}`)
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