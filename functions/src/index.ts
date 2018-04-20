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


const handleChange = async (type: string, index: algoliasearch.AlgoliaIndex, event: functions.Change < FirebaseFirestore.DocumentSnapshot > , context: functions.EventContext) => {
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

	// Document deleted
	else {
		try {
			const batchDelete = firebase.firestore().batch();
			if (type === 'posts') {
				// Delete all trades involved w/ this post
				const [buyerPosts, sellerPosts] = await Promise.all([
					firebase.firestore().collection('/trades').where('buyer.postId', '==', context.params.id).get(),
					firebase.firestore().collection('/trades').where('seller.postId', '==', context.params.id).get()
				]);

				buyerPosts.forEach(doc => batchDelete.delete(doc.ref));
				sellerPosts.forEach(doc => batchDelete.delete(doc.ref));
			}
			else {
				// Delete all trades involved with this user
				const trades = await firebase.firestore().collection('/trades').where('buyer.postId', '==', context.params.id).get();
				trades.forEach(trade => batchDelete.delete(trade.ref));

				// Reverse all ratings involved w/ this user
				const ratings = await firebase.firestore().collection('/ratings').where('rater', '==', context.params.id).get();
				ratings.forEach(rating => batchDelete.delete(rating.ref));
			}

			// Delete post from Algolia
			console.log('Deleting:', context.params.id, 'from Algolia');

			return Promise.all([
				batchDelete.commit(),
				index.deleteObject(context.params.id)
			]);
			
		} catch (error) {
			console.error(error);
			return error;
		}
	}
};


// Update the search postsIndex every time a blog post is written
export const postChanged = functions.firestore.document('/posts/{id}').onWrite((event, context) => handleChange('posts', postsIndex, event, context));

// Update the search postsIndex every time a blog post is written
export const usersChanged = functions.firestore.document('/users/{id}').onWrite((event, context) => handleChange('users', usersIndex, event, context));

export const ratingUpdated = functions.firestore.document('/ratings/{rating}').onWrite(async (event, context) => {
	const [userID, raterID] = context.params.rating.split('_');
	const data = await firebase.firestore().doc(`/users/${userID}`).get();

	console.log('UserID:', userID);
	console.log('RaterID:', raterID);

	const newRating = {};

	// Update rating
	if (event.before.exists && event.after.exists) {
		Object.assign(
			newRating, {
				totalRatings: data.data().totalRatings + event.after.get('value') - event.before.get('value'),
			}
		);
		console.log('Changing rating to:', newRating);
	}

	// New rating
	else if (!event.before.exists && event.after.exists) {
		Object.assign(
			newRating, {
				totalRatings: data.data().totalRatings + event.after.get('value'),
				numRatings: data.data().numRatings + 1,
			}
		);
		console.log('Adding new rating:', newRating);
	}

	// Deleted rating
	else if (event.before.exists && !event.after.exists) {
		Object.assign(
			newRating, {
				totalRatings: data.data().totalRatings - event.before.get('value'),
				numRatings: data.data().numRatings - 1,
			}
		);
		console.log('Deleted rating:', newRating);
	}
	
	return data.ref.set(newRating, {merge: true});
});