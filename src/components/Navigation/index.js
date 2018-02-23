import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import SignOutButton from '../SignOut';
import * as routes from '../../constants';
import logo from '../../assets/bartrLogo.png';
<<<<<<< HEAD
import './index.css'
=======
import './index.css';
>>>>>>> 1f70ded5a705df04b2b1fa3284e8cbccf2123bbf

const NavigationAuth = () =>
  <div className="buttonsGroup">
    <Link to={routes.HOME}><button className="navButton">Home</button></Link>
    <Link to={routes.ACCOUNT}><button className="navButton">Account</button></Link>
    <Link to={routes.SETTINGS}><button className="navButton">Settings</button></Link>
    <SignOutButton />
  </div>

const NavigationNonAuth = () =>
  <div className="buttonsGroup">
    <Link to={routes.LOGIN}><button className="navButton shift">Log In</button></Link>
    <Link to={routes.SIGN_UP}><button className="navButton right">Sign up</button></Link>
  </div>

class NavigationHeader extends Component {
  render() {
    return (
      <div className="navBar">
        <Link to={this.props.authUser ? routes.HOME : routes.LANDING}>
          <img className="logo" src={logo} alt="Bartr"></img>
        </Link>
        <div className="searchBar">
          <input type="text" className="searchBarInput" placeholder="Search..."/>
          <span role="img" aria-label="Search" className="searchBarButton">🔍</span>
        </div>
        { this.props.authUser ? <NavigationAuth /> : <NavigationNonAuth /> }
      </div>
    )
  }
}

const mapStateToProps = (store) => ({
  authUser: store.sessionState.authUser,
});

export default connect(mapStateToProps)(NavigationHeader);