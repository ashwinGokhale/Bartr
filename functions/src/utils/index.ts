import { format } from 'util';
import * as functions from 'firebase-functions';
import * as firebase from 'firebase-admin';
import * as googleStorage from '@google-cloud/storage';

const storage = googleStorage({
	projectId: functions.config().firebase.projectId,
	keyFilename: './serviceaccount.json'
});

const bucket = storage.bucket(functions.config().firebase.storageBucket);
bucket.makePublic();

export const uploadImageToStorage = (file: Express.Multer.File, id: string) => 
	new Promise<string>((resolve, reject) => {
		if (!file)
			return reject('No image file');

		if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/))
			return reject(`File: ${file.originalname} is an invalid image type`);
  
		
		const fileUpload = bucket.file(`posts/${id}/${file.originalname}`);
		// const fileUpload = bucket.file(`${file.originalname}`);
  
		const blobStream = fileUpload.createWriteStream({
			metadata: {
				contentType: file.mimetype
			}
		});
  
		blobStream.on('error', (error) => {
			console.error(error);
			return reject('Something is wrong! Unable to upload at the moment.');
		});
  
		blobStream.on('finish', async () => {
			// The public URL can be used to directly access the file via HTTP.
			return resolve(`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileUpload.name.replace(/\//g, '%2F')}?alt=media`);
		});

		blobStream.end(file.buffer);
	});
