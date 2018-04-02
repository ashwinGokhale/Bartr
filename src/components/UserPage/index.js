import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import { fetchUser, fetchPosts } from '../../actions';
import withAuthorization from '../Session/withAuthorization';
import Profile from './Profile';

class UserPage extends Component {
  constructor(props) {
	super(props);
	console.log('User Page Props:', props);
	this.state = {
		dbUser: null,
		feedPosts: []
	}
  }

  componentWillMount = async () => {
	  const id = this.props.match.params.userid;
	  const userInfo = await Promise.all([fetchUser(id), fetchPosts(id)]);
	  this.setState({dbUser: userInfo[0]});
	  this.setState({feedPosts: userInfo[1]});
  }

  render() {
    return (
      <Profile dbUser={this.state.dbUser} feedPosts={this.state.feedPosts} />
    );
  }
}

export default compose(
	withRouter,
  	withAuthorization((authUser) => !!authUser),
)(UserPage);
