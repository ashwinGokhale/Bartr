import { FEED_POSTS_SET, USER_POSTS_SET } from '../actions';

function postsReducer(state = {
	feedPosts: [],
	userPosts: [],
}, action) {
	switch (action.type) {
		case FEED_POSTS_SET: {
			return {
				...state,
				feedPosts: action.feedPosts
			}
		}
		case USER_POSTS_SET: {
			return {
				...state,
				userPosts: action.userPosts
			}
		}
		default:
			return state;
	}
}

export default postsReducer;