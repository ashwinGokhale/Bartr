import express from 'express';
import { firebase } from '../app';
export const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('API Home Page');
});

router.get("/news", (req, res) => {
	firebase.database().ref('/news').once('value').then(resp => {
	  res.json(resp.val())
	});
});

router.get("/employees", (req, res) => {
	firebase.database().ref('/employees').once('value').then(resp => {
	  res.json(resp.val())
	});
});