function sessionReducer(state = {
  authUser: null,
  dbUser: null
}, action) {
  switch(action.type) {
    case 'AUTH_USER_SET' : {
      return {
        ...state,
        authUser: action.authUser
      }
    }
    case 'DB_USER_SET' : {
      return {
        ...state,
        dbUser: action.dbUser
      }
    }
    default : return state;
  }
}

export default sessionReducer;