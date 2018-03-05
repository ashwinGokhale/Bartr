import { combineReducers } from 'redux';
import sessionReducer from './session';
import userReducer from './user';
import settingsReducer from './settings';
import postsReducer from './posts'

export default combineReducers({
  sessionState: sessionReducer,
  userState: userReducer,
  settingsState: settingsReducer,
  postsState: postsReducer
});
