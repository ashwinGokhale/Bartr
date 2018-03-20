import * as functions from 'firebase-functions';
import * as firebase from 'firebase-admin';
import * as googleStorage from '@google-cloud/storage';

const storage = googleStorage({
	projectId: functions.config().firebase.projectId,
	keyFilename: './serviceaccount.json'
});
  
const bucket = storage.bucket(functions.config().firebase.storageBucket);

export const uploadImageToStorage = (file: Express.Multer.File, uid: string) => 
	new Promise<string>((resolve, reject) => {
		if (!file)
			reject('No image file');

		if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/))
			reject(`File: ${file.originalname} is an invalid image type`)
  
		
		const fileUpload = bucket.file(`${uid}/${file.originalname}`);
  
		const blobStream = fileUpload.createWriteStream({
			metadata: {
				contentType: file.mimetype
			}
		});
  
		blobStream.on('error', (error) => {
			console.error(error);
			reject('Something is wrong! Unable to upload at the moment.');
		});
  
		blobStream.on('finish', () => {
			// The public URL can be used to directly access the file via HTTP.
			resolve(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
		});

		blobStream.end(file.buffer);
	});
