import * as express from 'express';
import * as firebase from 'firebase-admin';
import axios from 'axios';
import * as utils from '../utils';
export const router = express.Router();

// Get all users
router.get("/", async (req: utils.Req, res: utils.Res) => {
	try {
		const userDocs = await firebase.firestore().collection('/users').get();
		return utils.successRes(res, userDocs.docs.map(doc => doc.data()));
	} catch (error) {
		console.error('Error:', error);
		return utils.errorRes(res, 400, error);
	}
});

router.get('/:uid', async (req: utils.Req, res: utils.Res) => {
	try {
		const userSnap = await firebase.firestore().doc(`/users/${req.params.uid}`).get();
		console.log('UserSnap:', userSnap.data());
		return utils.successRes(res, userSnap.data());
	} catch (error) {
		console.error('Error:', error);
		return utils.errorRes(res, 400, error);
	}
});


// Create / update a post
router.post('/:uid', async (req: utils.Req, res: utils.Res) => {
	try {
		// const tok = await utils.getIDToken(req.headers.token);
		// if (!tok) return utils.errorRes(res, 401, 'Invalid token');
		const tok = req.token;
		if (tok.uid !== req.params.uid) return utils.errorRes(res, 401, 'Unauthorized');
		if (!req.params.uid) return utils.errorRes(res, 400, 'User must have a uid');
		if (!req.body.photoUrl) return utils.errorRes(res, 400, 'User must have a photo url');
		if (!req.body.email) return utils.errorRes(res, 400, 'User must have a description');
		if (!req.body.displayName) return utils.errorRes(res, 400, 'User must have a display name');

		const userRef = firebase.firestore().doc(`/users/${req.params.uid}`);
		const data = await userRef.get();
		if (data.exists) return utils.errorRes(res, 400, `User: ${req.params.uid} already exits`);
		
		const newUser = {
			uid: req.params.uid,
			photoUrl: req.body.photoUrl,
			displayName: req.body.displayName,
			contactInfo: {
				email: req.body.email,
				address: req.body.address || '',
				hideAddress: false,
				phoneNumber: req.body.phoneNumber || '',
				hidePhoneNumber: false
			},
			totalRatings: 5,
			numRatings: 1,
			lat: 40.427671,
			lng: -86.916978,
			radius: 250000
		};
		const { writeTime } = await userRef.set(newUser);
		// return utils.successRes(res, newUser);
		return utils.successRes(res, (await userRef.get()).data());
		
	} catch (error) {
		console.error('Error:', error);
		return utils.errorRes(res, 400, error);
	}
});

router.put('/:uid', async (req: utils.Req, res: utils.Res) => {
	try {
		console.log('Put user body:', req.body);
		const tok = req.token;
		if (tok.uid !== req.params.uid) return utils.errorRes(res, 401, 'Unauthorized');

		let lat = parseInt(req.body.lat, 10);
		let lng = parseInt(req.body.lng, 10);
		let address = req.body.contactInfo ? req.body.contactInfo.address : '';
		// Given address, get lat and lng
		if (address) {
			try {
				const { data } = await axios.get(
					'https://maps.googleapis.com/maps/api/geocode/json',
					{
						params: {
							address,
							key: process.env.GMAPS_KEY
						}
					}
				);
				if (!data.results.length) return utils.errorRes(res, 400, 'Invalid address: ' + address);
				console.log('Parsed address coordinates to:', data.results[0].geometry.location);
				lat = data.results[0].geometry.location.lat;
				lng = data.results[0].geometry.location.lng;
			} catch (error) {
				console.error(error);
				return utils.errorRes(res, 500, error);
			}
		}
		// // Given lat and lng, get address
		// if (lat && lng) {
		// 	const { data } = await axios.get(
		// 		'https://maps.googleapis.com/maps/api/geocode/json',
		// 		{
		// 			params: {
		// 				latlng: `${lat},${lng}`,
		// 				// key: functions.config().gmaps.key
		// 				key: process.env.GMAPS_KEY
		// 			}
		// 		}
		// 	);
		// 	if (!data.results.length) return utils.errorRes(res, 400, 'Invalid latitude and longitude: ' + lat + ', ' + lng);
			
		// 	address = data.results[0].formatted_address;
		// }

		if (!lat) return utils.errorRes(res, 400, 'Invalid Latitude: ' + req.body.lat);
		if (!lng) return utils.errorRes(res, 400, 'Invalid Longitude: ' + req.body.lng);
		
		const userBuilder = {};

		// Build properties of user to update
		Object.assign(
			userBuilder,
			req.body.photoUrl && { photoUrl: req.body.photoUrl },
			req.body.displayName && { displayName: req.body.displayName },
			lat && { lat },
			lng && { lng },
			req.body.radius && { radius: req.body.radius }
		);
		// Build contact info to update
		if (req.body.contactInfo) {
			
			const contactBuilder = {};
			Object.assign(
				contactBuilder,
				address && { address },
				req.body.contactInfo.phoneNumber && { phoneNumber: req.body.contactInfo.phoneNumber },
				'hideAddress' in req.body.contactInfo && { hideAddress: req.body.contactInfo.hideAddress ? true : false },
				'hidePhoneNumber' in req.body.contactInfo && { hidePhoneNumber: req.body.contactInfo.hidePhoneNumber ? true : false }
			);

			if (Object.keys(contactBuilder).length) Object.assign(userBuilder, {contactInfo: contactBuilder});
		}

		const userRef = firebase.firestore().doc(`/users/${req.params.uid}`);
		// const userSnap = await firebase.firestore().doc(`/users/${req.params.uid}`).set(
		const userSnap = await userRef.set(
			userBuilder,
			{merge: true}
		);

		// return utils.successRes(res, userBuilder);
		return utils.successRes(res, (await userRef.get()).data());
	} catch (error) {
		console.error('Error:', error);
		return utils.errorRes(res, 400, error);
	}
});

router.delete('/:uid', async (req: utils.Req, res: utils.Res) => {
	try {
		// const tok = await utils.getIDToken(req.headers.token);
		// if (!tok) return utils.errorRes(res, 401, 'Invalid token');
		const tok = req.token;
		if (tok.uid !== req.params.uid) return utils.errorRes(res, 401, 'Unauthorized');
		
		// Save user object for later
		const userSnap = await firebase.firestore().doc(`/users/${req.params.uid}`).get();
		
		// Delete user from Firebase
		await firebase.firestore().doc(`/users/${req.params.uid}`).delete();
		await firebase.auth().deleteUser(tok.uid);
		
		// Delete user's posts
		const userPosts = await firebase.firestore().collection('/posts').where('userId', '==', req.params.uid).get();
		const batchDelete = firebase.firestore().batch();
		userPosts.forEach(post => batchDelete.delete(post.ref));
		await batchDelete.commit();
		
		return utils.successRes(res, userSnap.data());
	} catch (error) {
		console.error('Error:', error);
		return utils.errorRes(res, 400, error);
	}
});