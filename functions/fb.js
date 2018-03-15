const firebase = require('firebase');
const axios = require('axios').default;
require("firebase/firestore");
firebase.initializeApp({
    apiKey: "AIzaSyDBETqIADd-E75bR2lSbS-VuqP5-RD1U4Q",
    authDomain: "bartr-b1856.firebaseapp.com",
    databaseURL: "https://bartr-b1856.firebaseio.com",
    projectId: "bartr-b1856",
    storageBucket: "bartr-b1856.appspot.com",
    messagingSenderId: "952082363953"
  });
const algoliasearch = require('algoliasearch');
const algolia = algoliasearch(
	'JAGNN9QV1Z',
	'23a58b75df085d3635a653ba0b54c27f'
);
const index = algolia.initIndex('posts');

// const posts = firebase.firestore().collection('/posts');
let postInfo = [
	{
	name: 'First',
	_geoloc: { lat: 37.947817, lng: -122.565753 } // Mt. Tamalpais
	},
	{
	name: 'Second',
	_geoloc: { lat: 37.680178, lng: -121.767719 } // Livermore
	},
	{
	name: 'Third',
	_geoloc: { lat: 37.329618, lng: -121.889881 } // San Jose
	},
	{
	name: 'Fourth',
	_geoloc: { lat: 37.481539, lng: -122.238526 } // Redwood City
	},
	{
	name: 'Fifth',
	_geoloc: { lat: 37.761631, lng: -122.424232 } // SF
	},
	{
	name: 'Sixth',
	_geoloc: { lat: 37.932302, lng: -122.347576 } // Richmond
	},
	{
	name: 'Seventh',
	_geoloc: { lat: 37.720096, lng: -122.155827 } // San Leandro
	},
	{
	name: 'Eighth',
	_geoloc: { lat: 38.017661, lng: -122.134034 } // Martinez
	},
	{
	name: 'Ninth',
	_geoloc: { lat: 38.106938, lng: -122.571546 } // Novato
	},
	{
	name: 'Tenth',
	_geoloc: { lat: 38.429970, lng: -122.711332 } // Santa Rosa
	}
]

function template ({name, _geoloc}, userId) {return{
	userId,
	title: `${name} Post`,
	picture: 'my-url',
	description: `This is really my ${name} post`,
	tags: [name, 'Post', 'Fo', 'Real'],
	state: 'PENDING',
	seller: 'test@test.com',
	_geoloc
}}

const uid = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjYyZjQ1NTM5ZTFjYTZhNjFjYjM2ZTI3N2FkYzRlZDAwNGVmODBjY2QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYmFydHItYjE4NTYiLCJhdWQiOiJiYXJ0ci1iMTg1NiIsImF1dGhfdGltZSI6MTUxOTk2Mjg4MywidXNlcl9pZCI6ImswdjByQW1DRTRWUmIxN2psU1ZrMTRGaEpvZzEiLCJzdWIiOiJrMHYwckFtQ0U0VlJiMTdqbFNWazE0RmhKb2cxIiwiaWF0IjoxNTIwMzEzOTcyLCJleHAiOjE1MjAzMTc1NzIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJ0ZXN0QHRlc3QuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.SxrbsbI50ZG9GhQVEdWYAWp_988tY158mPPt_N7Vcj5wXlfdTeEwSLq83QXULH0fg8qAUMJJ_Or05ZendIMRUncV9KoH85aTgb-XYs7Tt38xqh7J2shLeIAD-ZdOFIlaBq1HrZQML5wqA9RKj_CfBqUoneaPxfP94oH-PROHWNnHcMlBA_J4j1Ox0gspF_MLBowXw_XEXng1Rhv2W2NbTpSNImeBhFaFMekMXM92MGLgc1IC7dn2ipgfUQbzXizGCzEpJgrLnWov8wx9a-Fw2JaPsf6W-uJeTYQvsHM7XVQeFj78bkw8lXYoMuyptmx9BPXkv-68rpLLQLSsofxW2w';
const userId = 'k0v0rAmCE4VRb17jlSVk14FhJog1'
// postInfo.forEach(async info => {
// 	try {
// 		const resp = await axios.post(
// 			'http://localhost:5000/api/posts', 
// 			{
// 			...template(info, userId)
// 			},
// 			{
// 				headers: {
// 					token: uid
// 				}
// 			}
// 		)
// 		console.log(resp);
// 		const post = resp.data;
// 		console.log('Added:', post, 'to firestore')	
// 	} catch (error) {
// 		// console.log(error)
// 	}
// })

// axios.get(`http://localhost:5000/api/posts/user/${userId}`, {
// 	headers: {
// 		token: uid
// 	}
// })
// .then(resp => console.log(resp.data))
// .catch(err => console.error(err))

axios.get(`http://localhost:5000/api/posts/geo`, {
	headers: {
		token: uid
	},
	params: {
		lat: 37.761631, 
		lng: -122.424232,
		radius: 25000
	}
})
.then(resp => console.log(resp.data))
.catch(err => console.error(err))

// index.search("", {
// 	// "hitsPerPage": "10",
// 	// "page": "0",
// 	// "analytics": "false",
// 	"attributesToRetrieve": "title",
// 	// "facets": "[]",
// 	"aroundLatLng": '37.947817, -122.565753',
// 	"aroundRadius": 'all' // 1km Radius
// }).then(value => {
// 	console.log(value);
// })

// index.setSettings({
// 	'searchableAttributes': [
// 		'title',
// 		'tags',
// 		'seller',
// 		'description'
// 	  ],
// 	  'ranking': [
// 		'typo',
// 		'geo',
// 		'words',
// 		'attribute',
// 		'proximity',
// 		'exact',
// 		'custom'
// 	  ]
// })
// index.search({
// 	// query: 'query',
// 	aroundLatLng: '37.761631, -122.424232',
// 	// aroundLatLng: '0, 0',
// 	aroundRadius: 25000 // 25 km
// }).then(res => {
// 	console.log(res);
// });

// firebase.firestore().collection('/news').get().then(resp => {
// 	console.log(resp.docs.map(doc => doc.data()));
// })

// const postsRef = firebase.database().ref('/posts');
// postInfo.forEach(async info => {
// 	postsRef.push().set(template(info))
// 	// const addedPost = await posts.add(template(info));
// 	// const postDoc = await addedPost.get()
// 	// const post = postDoc.data();
// 	// post.objectID = postDoc.id;
// 	// index.saveObject(post).then(content => {
// 	// 	console.log('Saved ', content, 'to Algolia');
// 	// })
// 	// .catch(err => {
// 	// 	console.error('Error saving', content, 'to Algolia:', err);
// 	// })
// 	// console.log('Added:', post, 'to firestore');
// })

// const data = require('./data.json');
// Object.keys(data).forEach(key => {
//     const nestedContent = data[key];

//     if (typeof nestedContent === "object") {
//         Object.keys(nestedContent).forEach(docTitle => {
//             firebase.firestore()
//                 .collection(key)
//                 .doc(docTitle)
//                 .set(nestedContent[docTitle])
//                 .then((res) => {
//                     console.log("Document successfully written!");
//                 })
//                 .catch((error) => {
//                     console.error("Error writing document: ", error);
//                 });
//         });
//     }
// });