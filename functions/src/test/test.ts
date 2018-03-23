import * as chai from 'chai';
import * as sinon from 'sinon';
import * as supertest from 'supertest';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as firebase from 'firebase';
import * as assert from 'assert';
const serviceAccount = require('../../serviceaccount.json');
// tslint:disable-next-line:no-import-side-effect

chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));

let should = chai.should();
let expect = chai.expect;
let api = supertest('http://localhost:5000/api');
let config = {
    apiKey: "AIzaSyDBETqIADd-E75bR2lSbS-VuqP5-RD1U4Q",
    authDomain: "bartr-b1856.firebaseapp.com",
    databaseURL: "https://bartr-b1856.firebaseio.com",
    projectId: "bartr-b1856",
    storageBucket: "bartr-b1856.appspot.com",
    messagingSenderId: "952082363953"
};
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://bartr-b1856.firebaseio.com",
});
const app = firebase.initializeApp(config);

describe('-- API Tests --', () => {
    let user: firebase.User;
    let token;

    before(async() => {
        try {
            user = await firebase.auth().signInWithEmailAndPassword('apitests@tests.com','tests123');
            token = await user.getIdToken(true);
        } catch (error) {
            console.error(error);
            return error;
        }
    });

    describe("\n\n\n--Test Endpoints--\n", () => {
        // it('Should test / the landing page endpoint and return a 200 response', (done) => {
        //     api.get('/')
        //     .expect(200, done);
        // });
        // it('Should test /post endpoint and return a 200 response', (done) => {
        //     api.get('/posts')
        //     .expect(200, done);
        // });
        // it('Should test /login endopoint and return a 200 response', (done) => {
        //     api.get('/login')
        //     .expect(200, done);
        // });
        // it('Should test /signup endopoint and return a 200 response', (done) => {
        //     api.get('/signup')
        //     .expect(200, done);
        // });
        // it('Should test /pw-forget endopoint and return a 200 response', (done) => {
        //     api.get('/pw-forget')
        //     .expect(200, done);
        // });
        // it('Should test /chat endopoint and return a 200 response', (done) => {
        //     api.get('/chat')
        //     .expect(200, done);
        // });
    });
});