import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import { firebase } from '../../firebase';
import { fetchDBUser } from '../../actions';
import * as routes from '../../constants';

const withAuthorization = (condition) => (Component) => {
  class WithAuthorization extends React.Component {
    
    componentWillMount = () => {
      firebase.auth.onAuthStateChanged(authUser => {
        if (!condition(authUser))
          this.props.history.push(routes.LOGIN);
      });    
    }
  
    render() {

      return this.props.authUser ? <Component /> : null;
    }
  }

  const mapStateToProps = (state) => ({
    authUser: state.sessionState.authUser,
  });
  return compose(
    withRouter,
    connect(mapStateToProps, { fetchDBUser }),
  )(WithAuthorization);
}

export default withAuthorization;