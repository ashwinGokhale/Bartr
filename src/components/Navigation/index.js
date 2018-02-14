import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import SignOutButton from '../SignOut';
import * as routes from '../../constants';

const NavigationAuth = () =>
  <ul>
    <li><Link to={routes.LANDING}>Landing</Link></li>
    <li><Link to={routes.HOME}>Home</Link></li>
    <li><Link to={routes.ACCOUNT}>Account</Link></li>
    <li><Link to={routes.SETTINGS}>Settings</Link></li>
    <li><SignOutButton /></li>
  </ul>

const NavigationNonAuth = () =>
  <ul>
    <li><Link to={routes.LANDING}>Landing</Link></li>
    <li><Link to={routes.SIGN_IN}>Sign In</Link></li>
  </ul>

class NavigationHeader extends Component {
  render() {
    return (
      <div>
        { this.props.authUser ? <NavigationAuth /> : <NavigationNonAuth /> }
      </div>
    )
  }
}

const mapStateToProps = (store) => ({
  authUser: store.sessionState.authUser,
});

export default connect(mapStateToProps)(NavigationHeader);