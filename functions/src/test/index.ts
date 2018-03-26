import * as chai from 'chai';
import * as firebase from 'firebase';
// tslint:disable-next-line:no-implicit-dependencies
import * as request from 'supertest';

chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));

const ENDPOINT = 'http://localhost:5000/api';
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

	before(async() => {
		try {
			user = await firebase.auth().signInWithEmailAndPassword('apitests@tests.com','tests123');
			token = await user.getIdToken(true);
			testUser = await firebase.auth().createUserWithEmailAndPassword('apiuserstests@tests.com','tests123');	
			testToken = await testUser.getIdToken(true);
			// console.log('User:', user);
			// console.log('Token:', token);
			// console.log('Test User:', testUser);
			// console.log('Test Token:', testToken);

		} catch (error) {
			console.error(error);
			return error;
		}
	});

	describe('-- Test Endpoints --', () => {
		describe('Endpoint: /', () => {
			it('Should test /', done => {
				api
				.get('/')
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
	});

	describe('-- /posts Tests --', () => {
		let postId: string;
		it('Should create a post', done => {
			const testPost = {
				title: 'test',
				description: 'description',
				type: 'good',
				address: '305 N University St, West Lafayette, IN 47907',
				tags: ['Test', 'Tag']
			};

			api
			.post('/posts')
			.set({token})
			.field('title', 'test')
			.field('description', 'description')
			.field('type', 'good')
			.field('address', '305 N University St, West Lafayette, IN 47907')
			.field('tags', ['Test', 'Tag'])
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

		it('Should delete a post', done => {
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
				assert.property(data, 'tags');
				assert.property(data, 'userId');
				assert.property(data, 'postId');
				assert.property(data, 'createdAt');
				assert.property(data, 'lastModified');
				assert.property(data, '_geoloc');
				done();
			})
			.catch(err => done(err));
		});
	});


	describe('-- /users Tests --', () => {
		it('Should create the user', done => {
			api
			.post(`/users/${testUser.uid}`)
			.set({token:testToken})
			.send({
				uid: testUser.uid,
				displayName: 'display',
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

		it('Should get the user', done => {
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