import { combineReducers } from 'redux';
import sessionReducer from './session';
import userReducer from './user';
import postsReducer from './posts'

export default combineReducers({
  sessionState: sessionReducer,
  userState: userReducer,
  postsState: postsReducer
});
