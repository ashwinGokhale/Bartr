"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var firebase = require("firebase");
var algoliasearch = require("algoliasearch");
var request = require("supertest");
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
var algolia = algoliasearch('4JI0HWDPVQ', 'bf4351dbbfa6cea1d6368431735feca1');
var index = algolia.initIndex('posts');
var ENDPOINT = 'http://localhost:5000/api';
var assert = chai.assert;
var should = chai.should;
var expect = chai.expect;
var config = {
    apiKey: "AIzaSyDBETqIADd-E75bR2lSbS-VuqP5-RD1U4Q",
    authDomain: "bartr-b1856.firebaseapp.com",
    databaseURL: "https://bartr-b1856.firebaseio.com",
    projectId: "bartr-b1856",
    storageBucket: "bartr-b1856.appspot.com",
    messagingSenderId: "952082363953"
};
var app = firebase.initializeApp(config);
var api = request(ENDPOINT);
describe('-- API Tests --', function () {
    var user;
    var token;
    var testUser;
    var testToken;
    before(function () { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4, firebase.auth().signInWithEmailAndPassword('apitests@tests.com', 'tests123')];
                case 1:
                    user = _a.sent();
                    return [4, user.getIdToken(true)];
                case 2:
                    token = _a.sent();
                    return [4, firebase.auth().createUserWithEmailAndPassword('apiuserstests@tests.com', 'tests123')];
                case 3:
                    testUser = _a.sent();
                    return [4, testUser.getIdToken(true)];
                case 4:
                    testToken = _a.sent();
                    return [3, 6];
                case 5:
                    error_1 = _a.sent();
                    console.error(error_1);
                    return [2, error_1];
                case 6: return [2];
            }
        });
    }); });
    describe('-- Test Endpoints --', function () {
        describe('Endpoint: /', function () {
            it('Should test /', function (done) {
                api
                    .get('/')
                    .expect(200, done);
            });
        });
        describe('Endpoint: /users', function () {
            it('Should test /users', function (done) {
                api
                    .get('/users')
                    .set({ token: token })
                    .expect(200, done);
            });
            it('Should 401 Unauthorized', function (done) {
                api
                    .get('/users')
                    .expect(401, done);
            });
        });
        describe('Endpoint: /posts', function () {
            it('Should test /posts', function (done) {
                api
                    .get('/posts')
                    .set({ token: token })
                    .expect(200, done);
            });
            it('Should 401 Unauthorized', function (done) {
                api
                    .get('/posts')
                    .expect(401, done);
            });
        });
        describe('Endpoint: /posts/geo', function () {
            it('Should test /posts/geo', function (done) {
                api
                    .get('/posts/geo')
                    .query({
                    radius: 5000,
                    lat: 37,
                    lng: -122
                })
                    .set({ token: token })
                    .expect(200, done);
            });
            it('Should 401 Unauthorized', function (done) {
                api
                    .get('/posts/geo')
                    .query({
                    radius: 5000,
                    lat: 37,
                    lng: -122
                })
                    .expect(401, done);
            });
            it('Should error 400: No lat', function (done) {
                api
                    .get('/posts/geo')
                    .query({
                    radius: 5000,
                    lng: -122
                })
                    .set({ token: token })
                    .expect(400, done);
            });
        });
    });
    describe('\n-- Test /posts  --', function () {
        var postId;
        it('Should create a post', function (done) {
            var testPost = {
                title: "Unit test",
                description: 'Unit test',
                type: 'good',
                tags: ["unit", "test"],
                _geoloc: { lat: 40, lng: -40 },
                address: '305 N University St, West Lafayette, IN 47907',
            };
            api
                .post('/posts')
                .set({ token: token })
                .field('title', testPost.title)
                .field('description', testPost.description)
                .field('type', testPost.type)
                .field('address', testPost.address)
                .field('tags', testPost.tags)
                .attach('photos', '../src/assets/bartrLogo.png')
                .expect(200)
                .then(function (response) {
                var data = response.body.responseData;
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
                .catch(function (err) { return done(err); });
        });
        it('Should query posts', function (done) {
            api
                .get('/posts/geo')
                .query({
                radius: 25000,
                lat: 40.4242796,
                lng: -86.9293319
            })
                .set({ token: token })
                .expect(200)
                .then(function (response) {
                var data = response.body.responseData;
                assert.typeOf(data, 'array', 'Response data is an array');
                data.forEach(function (post) {
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
                .catch(function (error) { return done(error); });
        });
        it('Should fail to delete another user\'s post', function (done) {
            assert.isNotNull(postId, 'Post ID');
            api
                .delete("/posts/" + postId)
                .set({ token: testToken })
                .expect(401)
                .then(function (response) {
                assert.propertyVal(response.body, 'error', 'Unauthorized');
                done();
            })
                .catch(function (err) { return done(err); });
        });
        it('Should delete a post', function (done) {
            assert.isNotNull(postId, 'Post ID');
            api
                .delete("/posts/" + postId)
                .set({ token: token })
                .expect(200)
                .then(function (response) {
                var data = response.body.responseData;
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
                .catch(function (err) { return done(err); });
        });
    });
    describe('\n-- Test /users --', function () {
        it('Should create the user', function (done) {
            api
                .post("/users/" + testUser.uid)
                .set({ token: testToken })
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
                .then(function (response) {
                var data = response.body.responseData;
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
                .catch(function (err) { return done(err); });
        });
        it('Should get the user', function (done) {
            api
                .get("/users/" + testUser.uid)
                .set({ token: testToken })
                .expect(200)
                .then(function (response) {
                var data = response.body.responseData;
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
                .catch(function (err) { return done(err); });
        });
        it('Should fail to delete the different user', function (done) {
            api
                .delete("/users/" + user.uid)
                .set({ token: testToken })
                .expect(401)
                .then(function (response) {
                assert.propertyVal(response.body, 'error', 'Unauthorized');
                done();
            })
                .catch(function (err) { return done(err); });
        });
        it('Should delete the user', function (done) {
            api
                .delete("/users/" + testUser.uid)
                .set({ token: testToken })
                .expect(200)
                .then(function (response) {
                var data = response.body.responseData;
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
                .catch(function (err) { return done(err); });
        });
    });
    describe("\n\n\n--Test Algolia Queries--\n", function () {
        var algoliaPost = {
            tags: ["unit", "test"],
            title: "Unit test",
            _geoloc: { lat: 40, lng: -40 },
            description: "unit test",
            state: "PENDING",
            type: "good"
        };
        var algoliaPostID;
        it('Should add a post to the algolia posts index', function (done) {
            setTimeout(function () {
                index.addObject(algoliaPost)
                    .then(function (content) {
                    assert.isNotNull(content, 'Content not null');
                    assert.property(content, 'objectID', 'Content has id');
                    algoliaPostID = content.objectID;
                    done();
                })
                    .catch(function (err) { return done(err); });
            }, 2000);
        });
        it('Should query last post by tag and return a Promise', function () { return __awaiter(_this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, index.setSettings({
                            searchableAttributes: [
                                'title',
                                'tags',
                                'description'
                            ],
                        })];
                    case 1:
                        _a.sent();
                        return [4, index.search({
                                hitsPerPage: 100,
                                analytics: false,
                                attributesToRetrieve: ["*"],
                                facets: "[]",
                                query: 'Unit Test'
                            })];
                    case 2:
                        res = _a.sent();
                        assert(res.nbHits >= 1, 'Has at least 1 hit');
                        res.hits.forEach(function (data) {
                            assert.property(data, 'title');
                            assert.property(data, 'description');
                            assert.property(data, 'tags');
                            assert.property(data, 'state');
                            assert.property(data, 'type');
                            assert.property(data, '_geoloc');
                        });
                        return [2];
                }
            });
        }); });
        it('Should delete post from the algolia posts index', function (done) {
            index.deleteObject(algoliaPostID)
                .then(function (content) {
                assert.property(content, 'objectID', 'Content has id');
                assert.propertyVal(content, 'objectID', algoliaPostID);
                Object.assign(algoliaPost, { objectID: content.objectID });
                done();
            })
                .catch(function (err) { return done(err); });
        });
    });
});
//# sourceMappingURL=index.js.map