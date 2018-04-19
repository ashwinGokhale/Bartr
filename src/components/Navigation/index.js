import React, {Component} from 'react';
import { compose } from 'recompose';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { SignOutButton } from '../Common';
import { firebase } from '../../firebase';
import { setAuthUser, fetchDBUser, fetchTrades } from '../../actions';
import * as routes from '../../constants';
import logo from '../../assets/bartrLogo.png';
import './index.css'

const algoliasearch = require('algoliasearch');
const algolia = algoliasearch(
	'4JI0HWDPVQ',
	'bf4351dbbfa6cea1d6368431735feca1'
);
const index = algolia.initIndex('posts');

const NavigationAuth = () =>
  <span>
    {/* <div className="searchBar">
      <input onChange={this.updateTag} type="text" className="searchBarInput" placeholder="Search..."/>
      <span onClick={this.doSearch} role="img" aria-label="Search" className="searchBarButton">🔍</span>
    </div> */}
    <div className="buttonsGroup">
      <Link to={routes.HOME}><button className="navButton">Home</button></Link>
      <Link to={routes.ACCOUNT}><button className="navButton">Account</button></Link>
      <Link to={routes.TRADES}><button className="navButton">Trades</button></Link>
      <Link to={routes.CHAT}><button className="navButton">Chat</button></Link>
      <Link to={routes.SETTINGS}><button className="navButton">Settings</button></Link>
      <SignOutButton />
    </div>
  </span>

const NavigationNonAuth = () =>
  <div className="buttonsGroup">
    <Link to={routes.LOGIN}><button className="navButton shift">Log In</button></Link>
    <Link to={routes.SIGN_UP}><button className="navButton right">Sign up</button></Link>
  </div>

class NavigationHeader extends Component {

  constructor(props, context){
    super(props, context)
    this.updateTag = this.updateTag.bind(this)
    this.doSearch = this.doSearch.bind(this)
    this.state={
      curTag:''
    }
  }

  componentWillMount = () => {
    firebase.auth.onAuthStateChanged(authUser => {
      console.log('Auth State:', this.props.authState);
      if (!(!!authUser)) {
        this.props.setAuthUser(authUser);
        this.props.history.push(routes.LOGIN);
      }
      else if (!this.props.authState) {
        this.props.setAuthUser(authUser);
        this.props.fetchDBUser();
        this.props.fetchTrades();
      }
    });    
  }

  updateTag(event){
    this.setState({
      curTag: event.target.value
    })      
  }

  doSearch(){
    const {
      history,
    } = this.props;
    this.props.history.push({
      pathname: routes.DISPLAY_POSTS,
      search: "?curTag="+this.state.curTag,
      state: { myTag: this.state.curTag }
    });
  }

  render() {
    console.log('Navigation Props:', this.props);
    return (
      <div className="navBar">
        <Link to={this.props.authUser ? routes.HOME : routes.LANDING}>
          <img className="logo" src={logo} alt="Bartr"></img>
        </Link>
        <div className="searchBar">
          <input onChange={this.updateTag} type="text" className="searchBarInput" placeholder="Search..."/>
          <span onClick={this.doSearch} role="img" aria-label="Search" className="searchBarButton">🔍</span>
        </div>
        { this.props.authUser ? <NavigationAuth /> : <NavigationNonAuth /> }
      </div>
    )
  }
}

const mapStateToProps = (store) => ({
  ...store.sessionState,
});

export default compose(
  withRouter,
  connect(mapStateToProps, { setAuthUser, fetchDBUser, fetchTrades }),
)(NavigationHeader);