import { combineReducers } from 'redux';
import sessionReducer from './session';
import userReducer from './user';

export default combineReducers({
  sessionState: sessionReducer,
  userState: userReducer,
});
