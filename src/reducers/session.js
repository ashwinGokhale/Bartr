import { AUTH_USER_SET, DB_USER_SET } from '../actions';

function sessionReducer(state = {
  authUser: null,
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