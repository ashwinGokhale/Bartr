#!/usr/bin/env node

const chai = require('chai');
const assert = chai.assert;

const chaiPromised = require("chai-as-promised");
chai.use(chaiPromised);

const sinon = require('sinon');

describe('Cloud Functions', () => {
	var myFunctions, configStub, adminInitStub, functions, admin;

	before(() => {
		admin = require('firebase-admin');
		adminInitStub = sinon.stud(admin, 'initializeApp');
		functions = require('firebase-functions');
		configStub = sinon.stub(functions, 'config').returns({
			firebase: {
				apiKey: "AIzaSyDBETqIADd-E75bR2lSbS-VuqP5-RD1U4Q",
				authDomain: "bartr-b1856.firebaseapp.com",
 				databaseURL: "https://bartr-b1856.firebaseio.com",
 				projectId: "bartr-b1856",
  				storageBucket: "bartr-b1856.appspot.com",
  				messagingSenderId: "952082363953"
			}
		});
		myFunctions = require('../src/components/SignUp/index.js');	
	});

	after(() => {
		configStub.restore();
		adminInitStub.restore();
	});


  describe('createUserWithEmailAndPassword', () => {
	it('should return a 303 redirect', (done) => {
		const email = 'test@test.com';
		const password = 'password';
		
		myFunctions.createUserWithEmailAndPassword(email, password);
		databaseStub.restore();
	});
  });

})
