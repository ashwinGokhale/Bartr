import * as express from 'express';
import * as firebase from 'firebase-admin'
export const router = express.Router();

router.get("/", async (req, res) => {
	try {
		const resp = await firebase.firestore().collection('/employees').get();
		res.json(resp.docs.map(doc => doc.data()))
	} catch (err) {
		res.sendStatus(500).send(err);
	}
});
