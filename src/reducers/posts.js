function postsReducer(state = {
	posts: [],
  }, action) {
	switch(action.type) {
	  case 'POSTS_SET' : {
		return {
		  ...state,
		  posts: action.posts
		}
	  }
	  default : return state;
	}
  }
  
  export default postsReducer;