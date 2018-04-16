import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/App';
import store from './store';
import { auth } from './firebase';
import { fetchDBUser, setAuthUser } from './actions';
import './index.css';

store.dispatch(setAuthUser(auth.currentUser))
store.dispatch(fetchDBUser())

console.log('Initial Store:', store.getState());


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
