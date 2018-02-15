import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import SignOutButton from '../SignOut';
import * as routes from '../../constants';
import logo from '../../assets/bartrLogo.png';
import './index.css'

const NavigationAuth = () =>
  <div className="buttonsGroup">
    <Link to={routes.LANDING}><button className="navButton">Landing</button></Link>
    <Link to={routes.HOME}><button className="navButton">Home</button></Link>
    <Link to={routes.ACCOUNT}><button className="navButton">Account</button></Link>
    <Link to={routes.SETTINGS}><button className="navButton">Settings</button></Link>
    <SignOutButton />
  </div>

const NavigationNonAuth = () =>
  <div className="buttonsGroup">
    <Link to={routes.LANDING}><button className="navButton">Landing</button></Link>
    <Link to={routes.LOGIN}><button className="navButton">Login</button></Link>
    <Link to={routes.SIGN_UP}><button className="navButton">Sign up</button></Link>
  </div>

class NavigationHeader extends Component {
  render() {
    return (
      <div className="navBar">
        <div className="searchBar">
          <input type="text" className="searchBarInput" placeholder="Search..."/>
          <search className="searchBarButton">🔍</search>
        </div>
        <Link to={routes.HOME}>
          <img className="logo" src={logo} alt="Bartr"></img>
        </Link>
        { this.props.authUser ? <NavigationAuth /> : <NavigationNonAuth /> }
      </div>
    )
  }
}

const mapStateToProps = (store) => ({
  authUser: store.sessionState.authUser,
});

export default connect(mapStateToProps)(NavigationHeader);