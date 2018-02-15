import * as firebase from 'firebase';
import 'firebase/firestore';

const prodConfig = {
  apiKey: "AIzaSyDBETqIADd-E75bR2lSbS-VuqP5-RD1U4Q",
  authDomain: "bartr-b1856.firebaseapp.com",
  databaseURL: "https://bartr-b1856.firebaseio.com",
  projectId: "bartr-b1856",
  storageBucket: "bartr-b1856.appspot.com",
  messagingSenderId: "952082363953"
};

const devConfig = {
  apiKey: "AIzaSyDBETqIADd-E75bR2lSbS-VuqP5-RD1U4Q",
  authDomain: "bartr-b1856.firebaseapp.com",
  databaseURL: "https://bartr-b1856.firebaseio.com",
  projectId: "bartr-b1856",
  storageBucket: "bartr-b1856.appspot.com",
  messagingSenderId: "952082363953"
};

const config = process.env.NODE_ENV === 'production'
  ? prodConfig
  : devConfig;

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const db = firebase.firestore();
const auth = firebase.auth();

export {
  db,
  auth,
};
