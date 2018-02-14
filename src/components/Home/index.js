import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import axios from 'axios';

import withAuthorization from '../Session/withAuthorization';

class HomePage extends Component {
  componentDidMount() {
    const { onSetUsers } = this.props;
    axios.get('/api/users')
      .then(response => onSetUsers(response.data))
  }

  render() {
    const { users } = this.props;

    return (
      <div>
        <h1>Home</h1>
        <p>The Home Page is accessible by every signed in user.</p>

        { !!users && <UserList users={users} /> }
      </div>
    );
  }
}

const UserList = ({ users }) =>
  <div>
    <h2>List of Usernames of Users</h2>
    <p>(Saved on Sign Up in Firebase Database)</p>

    <ul>
      {Object.keys(users).map(key =>
        <li key={key}>
          <div>Name: {users[key].displayName}</div>
          <div>UID: {users[key].uid}</div>
        </li>
      )}
    </ul>
  </div>

const mapStateToProps = (state) => ({
  users: state.userState.users,
});

const mapDispatchToProps = (dispatch) => ({
  onSetUsers: (users) => dispatch({ type: 'USERS_SET', users }),
});

export default compose(
  withAuthorization((authUser) => !!authUser),
  connect(mapStateToProps, mapDispatchToProps)
)(HomePage);
