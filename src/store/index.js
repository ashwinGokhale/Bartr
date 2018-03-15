import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import { auth } from '../firebase';

export default createStore(
	rootReducer,
	composeWithDevTools(
		applyMiddleware(thunk, logger)
	)	
);