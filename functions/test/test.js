var chai = require('chai');
var sinon = require('sinon');
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
const firebase = require('firebase');
const supertest = require('supertest');
const functions = require('firebase-functions');
require('firebase/firestore');

var should = require('chai').should();
var expect = require('chai').expect;
var api = supertest('http://localhost:5000');

const algoliasearch = require('algoliasearch');
const algolia = algoliasearch(
	'4JI0HWDPVQ',
	'bf4351dbbfa6cea1d6368431735feca1'
);
const index = algolia.initIndex('posts');


describe('----Firestore Unit Tests---- \n\n', function(){
    var db;
    before(() => {
        var config = {
            apiKey: "AIzaSyDBETqIADd-E75bR2lSbS-VuqP5-RD1U4Q",
            authDomain: "bartr-b1856.firebaseapp.com",
            databaseURL: "https://bartr-b1856.firebaseio.com",
            projectId: "bartr-b1856",
            storageBucket: "bartr-b1856.appspot.com",
            messagingSenderId: "952082363953"
        };
        var app = firebase.initializeApp(config);
        db = firebase.firestore(app);
    });

    
    describe("\n--Posts Collection--\n", () => {
        it("Should add a post to firestore collection posts", () => {
            return output = db.collection("/posts").doc("Test").set({
                title: `Test post`,
	            picture: 'test pic',
	            description: `test description`,
	            tags: ['test', 'Post', 'Fo', 'Real'],
	            state: 'PENDING',
	            seller: 'test@test.com',
	            _geoloc: { lat: 37.947817, lng: -122.565753 }
            }).then(function(doc){
                console.log("Test document written successfully");
            }).catch(function(error){
                console.error("Error adding document: ", error);
            });
        });


        it("should get all posts", () => {
            return output = db.collection("/posts").get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log(doc.data().title);
                });
            });
        });

        it("should update the test document", () => {
            return output = db.collection("/posts").doc("Test")
            .update({
                title: 'Updated title'
            }).then(function(doc){
                console.log("Test document updated successfully");
            }).catch(function(error){
                console.error("Error updating document: ", error);
            });
        });

        it("should delete the test post", () => {
            return output = db.collection("/posts").doc("Test")
            .delete()
            .then(function() {
                console.log("Test document successfully removed");
            }).catch(function(error){
                console.error("Error removing document: ", error);
            });
        });
    });    

    describe("\n\n\n--Test Algolia Queries--\n", () => {
            it('Should add an index to the algolia indices posts', function(done){
                var objects = [{
                    tags: ["unit", "test"],
                    title: "Unit test",
                    _geoloc: { lat: 40, lng: -40 },
                    description: "unit test",
                    state: "PENDING",
                    type: "good"
                }];

                index.addObjects(objects, function(err, content){
                    console.log(content);
                    done();
                })
            })

            it('Should query last post by tag and return a Promise', function(done){
                //console.log("check");
                index.setSettings({
                    'searchableAttributes': [
                      'title',
                      'tags'
                    ]
                  });
                             
                var hold;
                const results = index.search("unit", {
                    "hitsPerPage": "100",
                    "analytics": "false",
                    "attributesToRetrieve": "*",
                    "facets": "[]"
                  }).then(res => {
                       console.log(res);
                       done();
                  });
                  
            })
    })

    describe("\n\n\n--Test Endpoints--\n", () => {
        it('Should test / the landing page endpoint and return a 200 response', function(done){
            api.get('/')
            .expect(200, done);
        });
        it('Should test /post endpoint and return a 200 response', function(done){
            api.get('/posts')
            .expect(200, done);
        });
        it('Should test /login endpoint and return a 200 response', function(done){
            api.get('/login')
            .expect(200, done);
        });
        it('Should test /signup endpoint and return a 200 response', function(done){
            api.get('/signup')
            .expect(200, done);
        });
        it('Should test /pw-forget endpoint and return a 200 response', function(done){
            api.get('/pw-forget')
            .expect(200, done);
        });
        it('Should test /chat endpoint and return a 200 response', function(done){
            api.get('/chat')
            .expect(200, done);
        });
        it('Should test /posts endpoint and return a 200 response', function(done){
            api.get('/posts')
            .expect(200, done);
        })
    });
});


