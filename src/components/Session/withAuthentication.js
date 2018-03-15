import React from 'react';
import { connect } from 'react-redux';
import { firebase } from '../../firebase';
import { fetchDBUser, setAuthUser } from '../../actions';
import axios from 'axios';

const withAuthentication = (Component) => {
  class WithAuthentication extends React.Component {
    
    authChanged = authUser => {
      if (authUser) {
        try {
          this.props.setAuthUser(authUser);
          this.props.fetchDBUser();
        } catch (error) {
          console.error(error);
        }
      }
      else 
        this.props.setAuthUser(null);
    }

    componentWillMount () {
      firebase.auth.onAuthStateChanged(this.authChanged);
    }

    render() {
      return (
        <Component />
      );
    }
  }

  return connect(null, { fetchDBUser, setAuthUser })(WithAuthentication);
}

export default withAuthentication;