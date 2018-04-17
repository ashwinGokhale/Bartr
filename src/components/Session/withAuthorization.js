import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import { firebase } from '../../firebase';
import { setAuthUser, fetchDBUser } from '../../actions';
import * as routes from '../../constants';

const withAuthorization = (condition, props) => (Component) => {
  class WithAuthorization extends React.Component {
    
    componentWillMount = () => {
      firebase.auth.onAuthStateChanged(authUser => {
        console.log('Auth state has changed to:', condition(authUser));
        console.log('Auth State:', this.props.authState);
        if (!condition(authUser)) {
          this.props.setAuthUser(authUser);
          this.props.history.push(routes.LOGIN);
        }
        else if (!this.props.authState) {
          this.props.setAuthUser(authUser);
          this.props.fetchDBUser();
        }
      });    
    }
  
    render() {
      return (this.props.authUser && this.props.dbUser) ? <Component {...this.props} {...props}/> : null;
    }
  }

  const mapStateToProps = (store) => ({
    ...store.sessionState,
    // authUser: store.sessionState.authUser,
    // dbUser: store.sessionState.dbUser,
  });
  return compose(
    withRouter,
    connect(mapStateToProps, { setAuthUser, fetchDBUser }),
  )(WithAuthorization);
}

export default withAuthorization;
