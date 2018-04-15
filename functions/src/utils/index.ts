import * as functions from 'firebase-functions';
import * as firebase from 'firebase-admin';
import * as googleStorage from '@google-cloud/storage';
const serviceAccount = require('../../serviceaccount.json');
const fbConfig = require('../../fbconfig.json');

const storage = googleStorage({
	projectId: serviceAccount.project_id,
	keyFilename: './serviceaccount.json'
});



// const bucket = storage.bucket(functions.config().firebase.storageBucket);
const bucket = storage.bucket(fbConfig.storageBucket);

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

export const successRes = (res, responseData) => res.json({status: 200, responseData });

export const errorRes = (res, status: number, error) =>
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

export const authorized = async (req, res, next) => {
	const userToken: string = req.headers.token as string;
	if (!userToken || !await getIDToken(userToken)) return errorRes(res, 401, 'Unauthorized');
	return next();
};