import * as functions from 'firebase-functions';
import * as firebase from 'firebase-admin';
import { Request, Response } from 'express';
const serviceAccount = require('../../serviceaccount.json');
const fbConfig = require('../../fbconfig.json');

// Initialize app and dependencies

firebase.initializeApp({
	credential: firebase.credential.cert(serviceAccount),
	...fbConfig
});

const bucket = firebase.storage().bucket();


export interface Req extends Request {
	token: firebase.auth.DecodedIdToken
}

export interface Res extends Response {}

export const getTrades = async (type: string, uid: string, buyer?: boolean) => {
	const transactions = await firebase.firestore().collection('/trades')
							.where('state', '==', type)
							.where(`${buyer ? 'buyer' : 'seller'}.userId`, '==', uid)
							.get();
    return transactions.docs.map(doc => doc.data());
}

export const closeSeller = async (res: Res, trade: FirebaseFirestore.DocumentSnapshot, buyer: FirebaseFirestore.DocumentSnapshot, seller: FirebaseFirestore.DocumentSnapshot) => {
	if (seller.data().state !== 'PENDING') return errorRes(res, 400, `Post: ${seller.data().postId} is not available for closing`);

	// Update the states to accepted
    const batchUpdate = firebase.firestore().batch();
	batchUpdate.update(trade.ref, 'seller.closed', true);
	batchUpdate.update(trade.ref, 'seller.post.state', 'CLOSED');
	batchUpdate.update(seller.ref, 'state', 'CLOSED');
	if (trade.data().buyer.closed) {
		batchUpdate.update(trade.ref, 'state', 'CLOSED');
		batchUpdate.update(trade.ref, 'buyer.post.state', 'CLOSED');
	}
    
    await batchUpdate.commit();

    return successRes(res, (await trade.ref.get()).data());
}

export const closeBuyer = async (res: Res, trade, buyer: FirebaseFirestore.DocumentSnapshot, seller: FirebaseFirestore.DocumentSnapshot) => {
	if (buyer.data().state !== 'PENDING') return errorRes(res, 400, `Post: ${buyer.data().postId} is not available for closing`);

	// Update the states to accepted
    const batchUpdate = firebase.firestore().batch();
	batchUpdate.update(trade.ref, 'buyer.closed', true);
	batchUpdate.update(trade.ref, 'buyer.post.state', 'CLOSED');
	batchUpdate.update(buyer.ref, 'state', 'CLOSED');
	if (trade.data().seller.closed) {
		batchUpdate.update(trade.ref, 'state', 'CLOSED');
		batchUpdate.update(trade.ref, 'seller.post.state', 'CLOSED');
	}
    
    await batchUpdate.commit();

    return successRes(res, (await trade.ref.get()).data());
}

export const uploadImageToStorage = (file: Express.Multer.File, id: string) => 
	new Promise<string>((resolve, reject) => {
		if (!file)
			reject('No image file');

		else if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/))
			reject(`File: ${file.originalname} is an invalid image type`);
  
		else {
			const fileUpload = bucket.file(`posts/${id}/${file.originalname}`);
  
			const blobStream = fileUpload.createWriteStream({
				metadata: {
					contentType: file.mimetype
				}
			});
	
			blobStream.on('error', (error) => {
				console.error(error);
				reject('Something is wrong! Unable to upload at the moment.');
			});
	
			blobStream.on('finish', async () => {
				// The public URL can be used to directly access the file via HTTP.
				resolve(`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileUpload.name.replace(/\//g, '%2F')}?alt=media`);
			});

			blobStream.end(file.buffer);
		}
	});

export const deletePostfromStorage = (postId: string) => 
	bucket.deleteFiles({
		prefix: `posts/${postId}/`
	})
	.then(value => null)
	.catch(error => error);

export const successRes = (res: Res, responseData) => res.json({status: 200, responseData });

export const errorRes = (res: Res, status: number, error) =>
	res.status(status).json({
		status,
		error
	});

export const getIDToken = async (userToken) => {
	if (!userToken) return null;
	try {
		return await firebase.auth().verifyIdToken(userToken, true);
	} catch (error) {
		return null;
	}
};

export const authorized = async (req: Req, res: Res, next) => {
	const userToken: string = req.headers.token as string;
	const token = await getIDToken(userToken);
	if (!token) {
		console.log('Request:\n\tBody:', req.body, '\n\tHeaders:', req.headers, '\n\tHad no token');
		return errorRes(res, 401, 'Unauthorized');
	}
	req.token = token;
	return next();
};