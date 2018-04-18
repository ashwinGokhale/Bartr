import * as express from 'express';
import * as firebase from 'firebase-admin';
import * as utils from '../utils';
export const router = express.Router();

router.post('/', async (req: utils.Req, res: utils.Res) => {
	console.log('Rating body:', req.body);
	const {userID, raterID} = req.body;
	let {value} = req.body;
	if (!raterID) return utils.errorRes(res, 400, 'Rating must have rater id');
	if (!userID) return utils.errorRes(res, 400, 'Rating must have user id');
	if (!value) return utils.errorRes(res, 400, 'Rating must have a value');
	value = parseFloat(value);
	if (value < 0.5 || value > 5) return utils.errorRes(res, 400, 'Rating value must be <= 5 and >= 0.5');
	const rater = await firebase.firestore().collection('/users').where('uid', '==', raterID).get();
	const user = await firebase.firestore().collection('/users').where('uid', '==', userID).get();
	if (rater.empty) return utils.errorRes(res, 400, `Rater with id: ${raterID} does not exist`);
	if (user.empty) return utils.errorRes(res, 400, `User with id: ${userID} does not exist`);
	const rating = {
		rater: raterID,
		user: userID,
		value
	};
	await firebase.firestore().doc(`/ratings/${userID}_${raterID}`).set(rating);
	return utils.successRes(res, rating);
});