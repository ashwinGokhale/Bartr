import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

const withAuthorization = (condition, props) => (Component) => {
  class WithAuthorization extends React.Component {
  
    render() {
      return (this.props.authUser && this.props.dbUser) ? <Component {...this.props} {...props}/> : null;
    }
  }

  const mapStateToProps = (store) => ({
    ...store.sessionState,
  });
  return compose(
    withRouter,
    connect(mapStateToProps),
  )(WithAuthorization);
}

export default withAuthorization;