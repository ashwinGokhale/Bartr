import * as functions from 'firebase-functions';
import * as firebase from 'firebase-admin';
import * as algoliasearch from 'algoliasearch';
const serviceAccount = require('../serviceaccount.json');
const fbConfig = require('../fbconfig.json');

// Initialize app and dependencies
firebase.initializeApp({
	credential: firebase.credential.cert(serviceAccount),
	databaseURL: fbConfig.databaseURL
});

const algolia = algoliasearch(
	functions.config().algolia.app,
	functions.config().algolia.key
);
const postsIndex = algolia.initIndex('posts');
const usersIndex = algolia.initIndex('users');


const handleChange = (index: algoliasearch.AlgoliaIndex, event: functions.Change < FirebaseFirestore.DocumentSnapshot > , context: functions.EventContext) => {
	// Document created/updated
	if (event.after.exists) {
		// Get the document
		const doc = event.after.data();

		// Add an 'objectID' field which Algolia requires
		doc.objectID = context.params.id;

		console.log('Saving:', doc, 'to Algolia');

		// Write to the algolia postsIndex
		return index.saveObject(doc);
	}
	// Post deleted
	else {
		console.log('Deleting:', context.params.id, 'from Algolia');

		// Delete post from Algolia
		return index.deleteObject(context.params.id);
	}
};


// Update the search postsIndex every time a blog post is written
export const postChanged = functions.firestore.document('/posts/{id}').onWrite((event, context) => handleChange(postsIndex, event, context));

// Update the search postsIndex every time a blog post is written
export const usersChanged = functions.firestore.document('/users/{id}').onWrite((event, context) => handleChange(usersIndex, event, context));

export const ratingUpdated = functions.firestore.document('/ratings/{rating}').onWrite(async (event, context) => {
	const [userID, raterID] = context.params.rating.split('_');
	const data = await firebase.firestore().doc(`/users/${userID}`).get();

	console.log('UserID:', userID);
	console.log('RaterID:', raterID);

	const newRating = {};

	// Update rating
	if (event.before.exists) {
		Object.assign(
			newRating, {
				totalRatings: data.data().totalRatings + event.after.get('value') - event.before.get('value'),
			}
		);
		console.log('Changing rating to:', newRating);
	}
	// New rating
	else {
		Object.assign(
			newRating, {
				totalRatings: data.data().totalRatings + event.after.get('value'),
				numRatings: data.data().numRatings + 1,
			}
		);
		console.log('Adding new rating:', newRating);
	}
	return data.ref.set(newRating, {
		merge: true
	});
});

// export const authUserCreated = functions.auth.user().onCreate(user => 
// 	firebase.firestore().doc(`/users/${user.uid}`).set({
// 		uid: user.uid,
// 		photoUrl: user.photoURL,
// 		displayName: user.displayName,
// 		contactInfo: {
// 			email: user.email,
// 			address: '',
// 			hideAddress: false,
// 			phoneNumber: user.phoneNumber || '',
// 			hidePhoneNumber: false
// 		},
// 		totalRatings: 5,
// 		numRatings: 1,
// 		lat: 0, 
// 		lng: 0 ,
// 		radius: 25000
// 	})
// );