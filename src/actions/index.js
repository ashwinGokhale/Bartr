import { auth } from '../firebase';
import axios from 'axios';

// Post actions
export const FEED_POSTS_SET = 'FEED_POSTS_SET';
export const USER_POSTS_SET = 'USER_POSTS_SET';

// Session actions
export const AUTH_USER_SET = 'AUTH_USER_SET';
export const DB_USER_SET = 'DB_USER_SET';

// Users actions
export const USERS_SET = 'USERS_SET';

// Post creators
export const onSetFeedPosts = (feedPosts) => ({ type: FEED_POSTS_SET, feedPosts });
export const onSetUserPosts = (userPosts) => ({ type: USER_POSTS_SET, userPosts });

// Session creators
export const onSetDBUser = (user) => ({ type: DB_USER_SET, dbUser: user });
export const onSetAuthUser = (authUser) => ({ type: AUTH_USER_SET, authUser });

// Post handlers
export const fetchFeedPosts = () => {
	return (dispatch, getState) => {
		auth.currentUser.getIdToken().then(token => {
			console.log(`Getting feed posts w/ user id: ${auth.currentUser.uid}`)
			console.log(`Feed GET settings:`, getState().sessionState.dbUser.lat,
			getState().sessionState.dbUser.lng,
			getState().sessionState.dbUser.radius)
			axios.get(
				`/api/posts/geo`,
				{
				  headers: {token},
				  params: {
					lat: getState().sessionState.dbUser.lat,
					lng: getState().sessionState.dbUser.lng,
					radius: getState().sessionState.dbUser.radius
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
			})
		})
	}
}

export const updateDBUser = (user) => {
	return async dispatch => {
		// Get DB user and update Redux store
		auth.currentUser.getIdToken().then(token => {
			console.log('Updating user:', auth.currentUser.uid, 'to:', user)
			axios.put(
				`/api/users/${auth.currentUser.uid}`, 
				user,
				{headers: {token}}
			)
			.then(response => {
				dispatch(onSetDBUser(user))
				console.log(response.data)
			})
			.catch(error => console.error(error))
		})
	}
}

export const setAuthUser = (authUser) => {
	return dispatch => {
		dispatch(onSetAuthUser(authUser))
	}
}
