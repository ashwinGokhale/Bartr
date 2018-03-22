import { FEED_POSTS_SET, FEED_POSTS_ERROR, USER_POSTS_SET, USER_POST_DELETED, USER_POSTS_ADD, USER_POSTS_ERROR } from '../actions';

function postsReducer(state = {
	feedPosts: [],
	feedPostsError: null,
	userPosts: [],
	userPostsError: null
}, action) {
	switch (action.type) {
		case FEED_POSTS_SET: {
			return {
				...state,
				feedPosts: action.feedPosts
			}
		}
		case FEED_POSTS_ERROR: {
			return {
				...state,
				feedPostsError: action.error
			}
		}
		case USER_POSTS_SET: {
			return {
				...state,
				userPosts: action.userPosts
			}
		}
		case USER_POST_DELETED: {
			return {
				...state,
				userPosts: state.userPosts.filter(item => item.postId !== action.postId)
			}
		}
		case USER_POSTS_ADD: {
			return {
				...state,
				userPosts: [...state.userPosts, action.post]
			}
		}
		case USER_POSTS_ERROR: {
			return {
				...state,
				userPostsError: action.error
			}
		}
		default:
			return state;
	}
}

export default postsReducer;