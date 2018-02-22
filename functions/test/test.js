var chai = require('chai');
var sinon = require('sinon');
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
const firebase = require('firebase');
const functions = require('firebase-functions');
require('firebase/firestore');

var should = require('chai').should();
var expect = require('chai').expect;

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
        }
        var app = firebase.initializeApp(config);
        db = firebase.firestore(app);
    })

    
    describe("--Posts Collection--\n", () => {
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
            })
        })

        it("should delete the test post", () => {
            return output = db.collection("/posts").doc("Test")
            .delete()
            .then(function() {
                console.log("Test document successfully removed");
            }).catch(function(error){
                console.error("Error removing document: ", error);
            })
        })
    });    
})


