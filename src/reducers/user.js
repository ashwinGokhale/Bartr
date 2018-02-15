function userReducer(state = {
  users: {},
}, action) {
  switch(action.type) {
    case 'USERS_SET' : {
      return {
        ...state,
        users: action.users
      }
    }
    default : return state;
  }
}

export default userReducer;