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
	return async (dispatch, getState) => {
		try {
			const token = await auth.currentUser.getIdToken()
			console.log(`Getting feed posts w/ user id: ${auth.currentUser.uid}`)
			console.log(
				`Feed GET settings:`, 
				getState().sessionState.dbUser.lat,
				getState().sessionState.dbUser.lng,
				getState().sessionState.dbUser.radius
			)
			const { data } = await axios.get(
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
			  
			console.log('Got feed posts:', data);
			dispatch(onSetFeedPosts(data))
			
		} catch (error) {
			console.error(error);
			return error;
		}
		
	}
}

export const fetchUserPosts = () => {
	return async dispatch => {
		try {
			const token = await auth.currentUser.getIdToken()
			// Get DB user and input into Redux store
			console.log(`Getting user posts w/ user id: ${auth.currentUser.uid}`)
			const { data } = await axios.get(
				`/api/posts/user/${auth.currentUser.uid}`,
				{headers: {token}}
			)
			console.log('Got user posts:', data);
			dispatch(onSetUserPosts(data))
			return data
		} catch (error) {
			console.error(error);
			return error;
		}
	}
}

// Session handlers
export const createUser = (user, token) => {
	return async dispatch => {
		try {
			const response = await axios.post(`/api/users/${user.uid}`, user, {headers: {token}})
			return response.data	
		} catch (error) {
			console.error(error)
			return error
		}
	}
}


export const fetchDBUser = () => {
	return async dispatch => {
		if (!auth.currentUser)
			dispatch(onSetDBUser(null))
		else {
			try {
				// Get DB user and update Redux store
				const token = await auth.currentUser.getIdToken()
				const response = await axios.get(
					`/api/users/${auth.currentUser.uid}`,
					{headers: {token}}
				)
				console.log('Got DB User:', response.data);
				dispatch(onSetDBUser(response.data));
				return response.data	
			} catch (error) {
				console.error(error)
				return error
			}
		}
	}
}

export const updateDBUser = (user) => {
	return async dispatch => {
		try {
			// Get DB user and update Redux store
			const token = await auth.currentUser.getIdToken()
			console.log('Updating user:', auth.currentUser.uid, 'to:', user)
			const response = await axios.put(
				`/api/users/${auth.currentUser.uid}`, 
				user,
				{headers: {token}}
			)
			dispatch(onSetDBUser(user))
			console.log(response.data)
			return response.data
		} catch (error) {
			console.error(error)
			return error
		}
	}
}

export const setAuthUser = (authUser) => {
	return dispatch => {
		dispatch(onSetAuthUser(authUser))
	}
}
