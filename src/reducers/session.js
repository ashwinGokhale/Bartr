import { AUTH_USER_SET, AUTH_STATE_SET, DB_USER_SET } from '../actions';

function sessionReducer(state = {
  authState: JSON.parse(localStorage.getItem('authState')) || false,
  authUser: JSON.parse(localStorage.getItem('authUser')) || null,
  dbUser: JSON.parse(localStorage.getItem('dbUser')) || null
}, action) {
  switch(action.type) {
    case AUTH_USER_SET : {
      localStorage.setItem('authUser', JSON.stringify(action.authUser))
      return {
        ...state,
        authUser: action.authUser
      }
    }
    case AUTH_STATE_SET : {
      localStorage.setItem('authState', JSON.stringify(action.authState))
      return {
        ...state,
        authState: action.authState
      }
    }
    case DB_USER_SET : {
      localStorage.setItem('dbUser', JSON.stringify(action.dbUser))
      return {
        ...state,
        dbUser: {
          ...state.dbUser,
          ...action.dbUser
        }
      }
    }
    default : return state;
  }
}

export default sessionReducer;