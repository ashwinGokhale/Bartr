import * as express from 'express';
import * as firebase from 'firebase'
export const router = express.Router();

router.get("/", (req, res) => {
	firebase.database().ref('/employees').once('value').then(resp => {
	  res.json(resp.val())
	});
});
