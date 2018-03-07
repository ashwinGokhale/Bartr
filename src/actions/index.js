import { auth } from '../firebase';
import axios from 'axios';
import store from '../store';

// Post actions
export const FEED_POSTS_SET = 'FEED_POSTS_SET';
export const USER_POSTS_SET = 'USER_POSTS_SET';

// Session actions
export const AUTH_USER_SET = 'AUTH_USER_SET';
export const DB_USER_SET = 'DB_USER_SET';

// Settings actions
export const GEOLOC_SET = 'GEOLOC_SET';
export const LAT_SET = 'LAT_SET';
export const LNG_SET = 'LNG_SET';
export const RADIUS_SET = 'RADIUS_SET';

// Users actions
export const USERS_SET = 'USERS_SET';

// Post creators
export const onSetFeedPosts = (feedPosts) => ({ type: FEED_POSTS_SET, feedPosts });
export const onSetUserPosts = (userPosts) => ({ type: USER_POSTS_SET, userPosts });

// Session creators
export const onSetDBUser = (user) => ({ type: DB_USER_SET, dbUser: user });
export const onSetAuthUser = (authUser) => ({ type: AUTH_USER_SET, authUser });

// Settings creators
export const onSetGeoloc = (_geoloc) => ({ type: GEOLOC_SET, _geoloc });
export const onSetRadius = (radius) => ({ type: RADIUS_SET, radius });
export const onSetLat = (lat) => ({ type: LAT_SET, lat });
export const onSetLng = (lng) => ({ type: LNG_SET, lng });

// Post handlers
export const fetchFeedPosts = () => {
	return dispatch => {
		auth.currentUser.getIdToken().then(token => {
			console.log(`Getting feed posts w/ user id: ${auth.currentUser.uid}`)
			console.log(`Feed GET settings:`, store.getState().settingsState.lat,
			store.getState().settingsState.lng,
			store.getState().settingsState.radius)
			axios.get(
				`/api/posts/geo`,
				{
				  headers: {token},
				  params: {
					lat: store.getState().settingsState.lat,
					lng: store.getState().settingsState.lng,
					radius: store.getState().settingsState.radius
				  }
				}
			  )
			  .then(response => {
				console.log('Got feed posts:', response.data);
				// this.setState({ feedPosts: response.data })
				dispatch(onSetFeedPosts(response.data))
			})
		})
	}
}

export const fetchUserPosts = () => {
	return dispatch => {
		auth.currentUser.getIdToken().then(token => {
			// Get DB user and input into Redux store
			console.log(`Getting user posts w/ user id: ${auth.currentUser.uid}`)
			axios.get(
			  `/api/posts/user/${auth.currentUser.uid}`,
			  {headers: {token}}
			)
			.then(response => {
			  console.log('Got user posts:', response.data);
			  dispatch(onSetUserPosts(response.data))
			})
		})
	}
}

// Session handlers
export const fetchDBUser = () => {
	return dispatch => {
		// Get DB user and update Redux store
		auth.currentUser.getIdToken().then(token => {
			axios.get(
				`/api/users/${auth.currentUser.uid}`,
				{headers: {token}}
			)
			.then(response => {
				console.log('Got DB User:', response.data);
				dispatch(onSetDBUser(response.data));
				dispatch(onSetLat(response.data.lat));
				dispatch(onSetLng(response.data.lng));
				dispatch(onSetRadius(response.data.radius));
			})
		})
	}
}

export const setAuthUser = (authUser) => {
	return dispatch => {
		dispatch(onSetAuthUser(authUser))
	}
}
