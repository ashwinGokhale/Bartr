import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import SignOutButton from '../SignOut';
import * as routes from '../../constants';
import logo from '../../assets/bartrLogo.png';
import './index.css'

// const NavigationAuth = () =>
//   <ul>
//     <li><Link to={routes.LANDING}>Landing</Link></li>
//     <li><Link to={routes.HOME}>Home</Link></li>
//     <li><Link to={routes.ACCOUNT}>Account</Link></li>
//     <li><Link to={routes.SETTINGS}>Settings</Link></li>
//     <li><SignOutButton /></li>
//   </ul>

// const NavigationNonAuth = () =>
//   <ul>
//     <li><Link to={routes.LANDING}>Landing</Link></li>
//     <li><Link to={routes.SIGN_IN}>Sign In</Link></li>
//   </ul>

const NavigationAuth = () =>
  <div className="buttonsGroup">
    <button className="navButton"><Link to={routes.LANDING}>Landing</Link></button>
    <button className="navButton"><Link to={routes.HOME}>Home</Link></button>
    <button className="navButton"><Link to={routes.ACCOUNT}>Account</Link></button>
    <button className="navButton right"><Link to={routes.SETTINGS}>Settings</Link></button>
    <SignOutButton />
  </div>

const NavigationNonAuth = () =>
  <div className="buttonsGroup">
    <button className="navButton"><Link to={routes.LANDING}>Landing</Link></button>
    <button className="navButton"><Link to={routes.LOGIN}>Login</Link></button>
    <button className="navButton right"><Link to={routes.SIGN_UP}>Sign up</Link></button>
  </div>

class NavigationHeader extends Component {
  render() {
    return (
      <div>
        <div className="navBar">
          <img className="logo" src={logo} alt="Bartr"></img>
          { this.props.authUser ? <NavigationAuth /> : <NavigationNonAuth /> }
          {/* <div className="buttonsGroup">
            { this.props.authUser ? <NavigationAuth /> : <NavigationNonAuth /> }
            <button className="navButton">Log In</button>
            <button className="navButton">Register</button>
            <button className="navButton">About</button>
            <button className="navButton">Support</button>
          </div> */}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (store) => ({
  authUser: store.sessionState.authUser,
});

export default connect(mapStateToProps)(NavigationHeader);