import React from 'react';
import { connect } from 'react-redux';
import { firebase } from '../../firebase';
import axios from 'axios';

const withAuthentication = (Component) => {
  class WithAuthentication extends React.Component {
    
    authChanged = async authUser => {
      const { onSetAuthUser, onSetGeoloc, onSetRadius } = this.props;
      if (authUser) {
        try {
          onSetAuthUser(authUser);
          const token = await authUser.getIdToken();
          const response = await axios.get(`/api/users/${authUser.uid}`,{headers: {token}})
          onSetGeoloc(response.data._geoloc)
          onSetRadius(response.data.radius)
        } catch (error) {
          console.error(error);
        }
      }
      else 
        onSetAuthUser(null);
    }

    componentDidMount () {
      firebase.auth.onAuthStateChanged(this.authChanged);
    }

    render() {
      return (
        <Component />
      );
    }
  }

  const mapDispatchToProps = (dispatch) => ({
    onSetAuthUser: (authUser) => dispatch({ type: 'AUTH_USER_SET', authUser }),
    onSetGeoloc: (_geoloc) => dispatch({ type: 'GEOLOC_SET', _geoloc }),
    onSetRadius: (radius) => dispatch({ type: 'RADIUS_SET', radius }),
  });

  return connect(null, mapDispatchToProps)(WithAuthentication);
}

export default withAuthentication;