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
        if (!condition(authUser))
          this.props.history.push(routes.LOGIN);
        else {
          this.props.setAuthUser(authUser);
          this.props.fetchDBUser();
        }
      });    
    }
  
    render() {

      return this.props.authUser ? <Component {...this.props} {...props}/> : null;
    }
  }

  const mapStateToProps = (store) => ({
    authUser: store.sessionState.authUser,
  });
  return compose(
    withRouter,
    connect(mapStateToProps, { setAuthUser, fetchDBUser }),
  )(WithAuthorization);
}

export default withAuthorization;