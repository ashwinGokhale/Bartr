function sessionReducer(state = {
  authUser: null,
}, action) {
  switch(action.type) {
    case 'AUTH_USER_SET' : {
      return {
        ...state,
        authUser: action.authUser
      }
    }
    default : return state;
  }
}

export default sessionReducer;