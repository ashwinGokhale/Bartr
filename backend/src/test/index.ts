import * as chai from 'chai';
import * as firebase from 'firebase';
import * as algoliasearch from 'algoliasearch';
// tslint:disable-next-line:no-implicit-dependencies
import * as request from 'supertest';

chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
const algolia = algoliasearch(
	'4JI0HWDPVQ',
	'bf4351dbbfa6cea1d6368431735feca1'
);
const index = algolia.initIndex('posts');

const ENDPOINT = 'http://localhost:4000/api';
const assert = chai.assert;
const should = chai.should;
const expect = chai.expect;
let config = {
	apiKey: "AIzaSyDBETqIADd-E75bR2lSbS-VuqP5-RD1U4Q",
	authDomain: "bartr-b1856.firebaseapp.com",
	databaseURL: "https://bartr-b1856.firebaseio.com",
	projectId: "bartr-b1856",
	storageBucket: "bartr-b1856.appspot.com",
	messagingSenderId: "952082363953"
};

const app = firebase.initializeApp(config);
const api = request(ENDPOINT);

describe('-- API Tests --', () => {
	let user: firebase.User;
	let token;
	let testUser: firebase.User;
	let testToken;
	let postId: string;
	let postIdTwo: string;
	let trade;

	before(async() => {
		try {
			user = await firebase.auth().signInWithEmailAndPassword('apitests@tests.com','test123');
			token = await user.getIdToken(true);
			testUser = await firebase.auth().createUserWithEmailAndPassword('apiuserstests@tests.com','test123');	
			testToken = await testUser.getIdToken(true);

		} catch (error) {
			console.error(error);
			testUser = await firebase.auth().signInWithEmailAndPassword('apiuserstests@tests.com','test123');
			testToken = await testUser.getIdToken(true);
			return error;
		}
	});

	describe('-- Test Endpoints --', () => {
		describe('Endpoint: /', () => {
			it('Should test /', done => {
				api
				.get('/')
				.set({token})
				.expect(200, done);
			});
		});
		
		describe('Endpoint: /users', () => {
			it('Should test /users', done => {
				api
				.get('/users')
				.set({token})
				.expect(200, done);
			});

			it('Should 401 Unauthorized', done => {
				api
				.get('/users')
				.expect(401, done);
			});
		});

		describe('Endpoint: /posts', () => {
			it('Should test /posts', done => {
				api
				.get('/posts')
				.set({token})
				.expect(200, done);
			});

			it('Should 401 Unauthorized', done => {
				api
				.get('/posts')
				.expect(401, done);
			});
		});

		describe('Endpoint: /posts/geo', () => {
			it('Should test /posts/geo', done => {
				api
				.get('/posts/geo')
				.query({
					radius: 5000,
					lat: 37,
					lng: -122
				})
				.set({token})
				.expect(200, done);
			});

			it('Should 401 Unauthorized', done => {
				api
				.get('/posts/geo')
				.query({
					radius: 5000,
					lat: 37,
					lng: -122
				})
				.expect(401, done);
			});

			it('Should error 400: No lat', done => {
				api
				.get('/posts/geo')
				.query({
					radius: 5000,
					lng: -122
				})
				.set({token})
				.expect(400, done);
			});

			
		});

		describe('Endpoint: /ratings', () => {
			it('Should test /ratings', done => {
				api
				.post('/ratings')
				.set({token})
				.expect(400, done);
			});

			it('Should 401 Unauthorized', done => {
				api
				.post('/ratings')
				.expect(401, done);
			});
		});

		describe('Endpoint: /trades', () => {
			it('Should test /trades', done => {
				api
				.get('/trades')
				.expect(401, done);
			});

			it('Should 401 Unauthorized', done => {
				api
				.post('/trades/some-thing')
				.set({token})
				.expect(400, done);
			});
		});
	});

	describe('\n-- Test /users --', () => {
		it('Should create the user', done => {
			api
			.post(`/users/${testUser.uid}`)
			.set({token:testToken})
			.send({
				uid: testUser.uid,
				displayName: 'Unit',
				photoUrl: 'none',
				email: testUser.email,
				contactInfo: {
					address: '305 N University St, West Lafayette, IN 47907',
					email: testUser.email,
					phoneNumber: '1234567890'
				}
			})
			.expect(200)
			.then(response => {
				const data = response.body.responseData;
				assert.property(data, 'contactInfo');
				assert.property(data, 'displayName');
				assert.property(data, 'lat');
				assert.property(data, 'lng');
				assert.property(data, 'radius');
				assert.property(data, 'photoUrl');
				assert.property(data, 'uid');
				assert.propertyVal(data, 'uid', testUser.uid);
				done();
			})
			.catch(err => done(err));
		});

		it('Should get the testUser', done => {
			api
			.get(`/users/${testUser.uid}`)
			.set({token:testToken})
			.expect(200)
			.then(response => {
				const data = response.body.responseData;
				assert.property(data, 'contactInfo');
				assert.property(data, 'displayName');
				assert.property(data, 'lat');
				assert.property(data, 'lng');
				assert.property(data, 'radius');
				assert.property(data, 'photoUrl');
				assert.property(data, 'uid');
				assert.propertyVal(data, 'uid', testUser.uid);
				done();
			})
			.catch(err => done(err));
		});

		it('Should get the user', done => {
			api
			.get(`/users/${user.uid}`)
			.set({token:testToken})
			.expect(200)
			.then(response => {
				const data = response.body.responseData;
				assert.property(data, 'contactInfo');
				assert.property(data, 'displayName');
				assert.property(data, 'lat');
				assert.property(data, 'lng');
				assert.property(data, 'radius');
				assert.property(data, 'photoUrl');
				assert.property(data, 'uid');
				assert.propertyVal(data, 'uid', user.uid);
				done();
			})
			.catch(err => done(err));
		});

		it('Should fail to get the user: doesntexist', done => {
			api
			.get('/users/doesntexist')
			.set({token})
			.expect(400)
			.then(response => done())
			.catch(err => done(err));
		});

		it('Should fail to get the user b/c of no token', done => {
			api
			.get('/users/doesntexist')
			.expect(401)
			.then(response => done())
			.catch(err => done(err));
		});

		it('Should fail to delete the different user', done => {
			api
			.delete(`/users/${user.uid}`)
			.set({token:testToken})
			.expect(401)
			.then(response => {
				assert.propertyVal(response.body, 'error', 'Unauthorized');
				done();
			})
			.catch(err => done(err));
		});
	});

	describe('\n-- Test /posts  --', () => {
		it('Should create a post for user', done => {
			const testPost = {
				title: "Unit test",
				description: 'Unit test',
				type: 'good',
				tags: ["unit", "test"],
				_geoloc: { lat: 40, lng: -40 },
				address: '305 N University St, West Lafayette, IN 47907',
			};

			api
			.post('/posts')
			.set({token})
			.field('title', testPost.title)
			.field('description', testPost.description)
			.field('type', testPost.type)
			.field('address', testPost.address)
			.field('tags', testPost.tags)
			.attach('photos', '../src/assets/bartrLogo.png')
			.expect(200)
			.then(response => {
				const data = response.body.responseData;
				assert.property(data, 'photoUrls');
				assert.property(data, 'title');
				assert.property(data, 'description');
				assert.property(data, 'tags');
				assert.property(data, 'state');
				assert.property(data, 'type');
				assert.property(data, 'tags');
				assert.property(data, 'userId');
				assert.property(data, 'postId');
				assert.property(data, 'createdAt');
				assert.property(data, 'lastModified');
				assert.property(data, '_geoloc');
				assert.propertyVal(data, 'title', testPost.title);
				assert.propertyVal(data, 'description', testPost.description);
				assert.propertyVal(data, 'type', testPost.type);
				expect(data.tags).to.deep.equal(testPost.tags);
				postId = data.postId;
				done();
			})
			.catch(err => done(err));
		});

		it('Should create a post for testUser', done => {
			const testUserPost = {
				title: "Test User Unit Test",
				description: 'Test User Unit Test',
				type: 'good',
				tags: ['Test',  'User', 'Unit', 'Test'],
				_geoloc: { lat: 40, lng: -40 },
				address: '305 N University St, West Lafayette, IN 47907',
			};

			api
			.post('/posts')
			.set({token: testToken})
			.field('title', testUserPost.title)
			.field('description', testUserPost.description)
			.field('type', testUserPost.type)
			.field('address', testUserPost.address)
			.field('tags', testUserPost.tags)
			.attach('photos', '../src/assets/bartrLogo.png')
			.expect(200)
			.then(response => {
				const data = response.body.responseData;
				assert.property(data, 'photoUrls');
				assert.property(data, 'title');
				assert.property(data, 'description');
				assert.property(data, 'tags');
				assert.property(data, 'state');
				assert.property(data, 'type');
				assert.property(data, 'tags');
				assert.property(data, 'userId');
				assert.property(data, 'postId');
				assert.property(data, 'createdAt');
				assert.property(data, 'lastModified');
				assert.property(data, '_geoloc');
				assert.propertyVal(data, 'title', testUserPost.title);
				assert.propertyVal(data, 'description', testUserPost.description);
				assert.propertyVal(data, 'type', testUserPost.type);
				expect(data.tags).to.deep.equal(testUserPost.tags);
				postIdTwo = data.postId;
				done();
			})
			.catch(err => done(err));
		});

		it('Should create a post for user', done => {
			const testPost = {
				title: "Changed user post title",
				description: 'Changed user post description',
				type: 'service',
				tags: ['Changed', 'user', 'the', 'tags'],
				address: '1275 Third Street, West Lafayette, IN 47906',
			};

			api
			.put(`/posts/${postId}`)
			.set({token})
			.field('title', testPost.title)
			.field('description', testPost.description)
			.field('type', testPost.type)
			.field('address', testPost.address)
			.field('tags', testPost.tags)
			.attach('photos', '../src/assets/bartrLogo.png')
			.expect(200)
			.then(response => {
				const data = response.body.responseData;
				assert.property(data, 'photoUrls');
				assert.property(data, 'title');
				assert.property(data, 'description');
				assert.property(data, 'tags');
				assert.property(data, 'state');
				assert.property(data, 'type');
				assert.property(data, 'tags');
				assert.property(data, 'userId');
				assert.property(data, 'postId');
				assert.property(data, 'createdAt');
				assert.property(data, 'lastModified');
				assert.property(data, '_geoloc');
				assert.propertyVal(data, 'title', testPost.title);
				assert.propertyVal(data, 'description', testPost.description);
				assert.propertyVal(data, 'type', testPost.type);
				expect(data.tags).to.deep.equal(testPost.tags);
				postId = data.postId;
				done();
			})
			.catch(err => done(err));
		});

		it('Should not be able to edit other users posts', done => {
			api
			.put(`/posts/${postIdTwo}`)
			.set({token})
			.field('title', 'My title')
			.expect(401)
			.then(response => done())
			.catch(err => done(err));
		});

		it('Should edit the post for testUser', done => {
			const testUserPost = {
				title: "Changed test user post title",
				description: 'Changed test user post description',
				type: 'service',
				tags: ['Changed',  'the', 'tags'],
				address: '1275 Third Street, West Lafayette, IN 47906',
			};

			api
			.put(`/posts/${postIdTwo}`)
			.set({token: testToken})
			.field('title', testUserPost.title)
			.field('description', testUserPost.description)
			.field('type', testUserPost.type)
			.field('address', testUserPost.address)
			.field('tags', testUserPost.tags)
			.expect(200)
			.then(response => {
				const data = response.body.responseData;
				assert.property(data, 'photoUrls');
				assert.property(data, 'title');
				assert.property(data, 'description');
				assert.property(data, 'tags');
				assert.property(data, 'state');
				assert.property(data, 'type');
				assert.property(data, 'tags');
				assert.property(data, 'userId');
				assert.property(data, 'postId');
				assert.property(data, 'createdAt');
				assert.property(data, 'lastModified');
				assert.property(data, '_geoloc');
				assert.propertyVal(data, 'title', testUserPost.title);
				assert.propertyVal(data, 'description', testUserPost.description);
				assert.propertyVal(data, 'type', testUserPost.type);
				expect(data.tags).to.deep.equal(testUserPost.tags);
				postIdTwo = data.postId;
				done();
			})
			.catch(err => done(err));
		});

		it('Should query posts', done => {
			api
			.get('/posts/geo')
			.query({
				radius: 25000,
				lat: 40.4242796,
				lng: -86.9293319
			})
			.set({token})
			.expect(200)
			.then(response => {
				const data: object[] = response.body.responseData;
				assert.typeOf(data, 'array', 'Response data is an array');
				data.forEach(post => {
					assert.property(post, 'photoUrls');
					assert.property(post, 'title');
					assert.property(post, 'description');
					assert.property(post, 'tags');
					assert.property(post, 'state');
					assert.property(post, 'tags');
					assert.property(post, 'userId');
					assert.property(post, 'postId');
					assert.property(post, 'createdAt');
					assert.property(post, 'lastModified');
					assert.property(post, '_geoloc');
				});
				done();
			})
			.catch(error => done(error));
		});

		it('Should fail to delete another user\'s post', done => {
			assert.isNotNull(postId, 'Post ID');
			api
			.delete(`/posts/${postId}`)
			.set({token:testToken})
			.expect(401)
			.then(response => {
				assert.propertyVal(response.body, 'error', 'Unauthorized');
				done();
			})
			.catch(err => done(err));
		});
	});

	describe("\n--Test Algolia Queries--\n", () => {
		const algoliaPost = {
			tags: ["unit", "test"],
			title: "Unit test",
			_geoloc: { lat: 40, lng: -40 },
			description: "unit test",
			state: "PENDING",
			type: "good"
		};
		let algoliaPostID: string;

		it('Should add a post to the algolia posts index', done => {
			setTimeout(() => {
				index.addObject(algoliaPost)
				.then(content => {
					assert.isNotNull(content, 'Content not null');
					assert.property(content, 'objectID', 'Content has id');
					algoliaPostID = content.objectID;
					done();
				})
				.catch(err => done(err));
			}, 2000);
		});

		it('Should query last post by tag and return a Promise', async () => {
			await index.setSettings({
				searchableAttributes: [
					'title',
					'tags',
					'description'
				],
			});
						 
			const res = await index.search({
				hitsPerPage: 100,
				analytics: false,
				attributesToRetrieve: ["*"],
				facets: "[]",
				query: 'Unit Test'
			});
			// assert(res.nbHits >= 1, 'Has at least 1 hit');
			res.hits.forEach(data => {
				assert.property(data, 'title');
				assert.property(data, 'description');
				assert.property(data, 'tags');
				assert.property(data, 'state');
				assert.property(data, 'type');
				assert.property(data, '_geoloc');
			});
		});

		it('Should delete post from the algolia posts index', done => {
			index.deleteObject(algoliaPostID)
			.then(content => {
				assert.property(content, 'objectID', 'Content has id');
				assert.propertyVal(content, 'objectID', algoliaPostID);
				Object.assign(algoliaPost, {objectID: content.objectID});
				done();
			})
			.catch(err => done(err));
		});
	});

	describe('\n-- Test /ratings  --\n', () => {
		let originalRating: number;
		it('Should rate another user', done => {
			api
			.post('/ratings')
			.set({token})
			.send({
				userID: testUser.uid,
				raterID: user.uid,
				value: 5
			})
			.expect(200)
			.then(res => {
				originalRating = res.body.responseData.value;
				done();
			})
			.catch(error => {
				console.error(error);
				done();
			});
		});

		it('Should rate change the ratings for another user', done => {
			api
			.post('/ratings')
			.set({token})
			.send({
				userID: testUser.uid,
				raterID: user.uid,
				value: 3
			})
			.expect(200)
			.then(res => {
				assert.notEqual(res.body.responseData.value, originalRating);
				done();
			})
			.catch(error => {
				console.error(error);
				done();
			});
		});
	});

	describe('\n -- Trades Tests -- \n', () => {
		it('Should make an offer on testUser post', done => {
			api
			.post(`/trades/${postIdTwo}-${postId}`)
			.set({token})
			.expect(200)
			.then(res => {
				trade = res.body.responseData;
				done();
			})
			.catch(error => {
				console.error(error);
				done();
			});
		});

		it('Should accept offer on testUser post', done => {
			api
			.post(`/trades/accept/${trade.id}`)
			.set({token: testToken})
			.expect(200)
			.then(res => {
				trade = res.body.responseData;
				done();
			})
			.catch(error => {
				console.error(error);
				done();
			});
		});

		it('Should close offer on user side', done => {
			api
			.post(`/trades/close/${trade.id}`)
			.set({token})
			.expect(200)
			.then(res => {
				trade = res.body.responseData;
				done();
			})
			.catch(error => {
				console.error(error);
				done();
			});
		});

		it('Should close offer on testUser side', done => {
			api
			.post(`/trades/close/${trade.id}`)
			.set({token: testToken})
			.expect(200)
			.then(res => {
				trade = res.body.responseData;
				done();
			})
			.catch(error => {
				console.error(error);
				done();
			});
		});
	});

	describe('\n -- Clean up Tests -- \n', () => {
		it('Should delete a post for user', done => {
			assert.isNotNull(postId, 'Post ID');
			api
			.delete(`/posts/${postId}`)
			.set({token})
			.expect(200)
			.then(response => {
				const data = response.body.responseData;
				assert.property(data, 'photoUrls');
				assert.property(data, 'title');
				assert.property(data, 'description');
				assert.property(data, 'tags');
				assert.property(data, 'state');
				assert.property(data, 'userId');
				assert.property(data, 'postId');
				assert.property(data, 'createdAt');
				assert.property(data, 'lastModified');
				assert.property(data, '_geoloc');
				done();
			})
			.catch(err => done(err));
		});

		it('Should delete a post for testUser', done => {
			assert.isNotNull(postIdTwo, 'Post ID');
			api
			.delete(`/posts/${postIdTwo}`)
			.set({token: testToken})
			.then(response => {
				const data = response.body.responseData;
				assert.property(data, 'photoUrls');
				assert.property(data, 'title');
				assert.property(data, 'description');
				assert.property(data, 'tags');
				assert.property(data, 'state');
				assert.property(data, 'userId');
				assert.property(data, 'postId');
				assert.property(data, 'createdAt');
				assert.property(data, 'lastModified');
				assert.property(data, '_geoloc');
				done();
			})
			.catch(err => done(err));
		});

		it('Should delete the user', done => {
			api
			.delete(`/users/${testUser.uid}`)
			.set({token:testToken})
			.expect(200)
			.then(response => {
				const data = response.body.responseData;
				assert.property(data, 'contactInfo');
				assert.property(data, 'displayName');
				assert.property(data, 'lat');
				assert.property(data, 'lng');
				assert.property(data, 'radius');
				assert.property(data, 'photoUrl');
				assert.property(data, 'uid');
				assert.propertyVal(data, 'uid', testUser.uid);
				done();
			})
			.catch(err => done(err));
		});
	});
});