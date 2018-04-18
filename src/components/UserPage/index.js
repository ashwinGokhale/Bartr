import React, { Component } from 'react';
import { compose } from 'recompose';
import { fetchUser, fetchPosts } from '../../actions';
import withAuthorization from '../Session/withAuthorization';
import Profile from '../Common/Profile';

class UserPage extends Component {
  constructor(props) {
		super(props);
		console.log('User Page Props:', props);
		this.state = {
			dbUser: null,
			feedPosts: [],
			currentUser: false
		}
  }

  componentWillMount = async () => {
	  const { id } = this.props.match.params;
		const userInfo = await Promise.all([fetchUser(id), fetchPosts(id)]);
		console.log('Got userInfo:', userInfo);
		if (this.props.authUser && this.props.authUser.uid === userInfo[0].uid) this.setState({currentUser: true});
	  this.setState({dbUser: userInfo[0]});
	  this.setState({feedPosts: userInfo[1]});
  }

  render() {
    return (
      <Profile dbUser={this.state.dbUser} feedPosts={this.state.feedPosts} currentUser={this.state.currentUser} />
    );
  }
}

export default compose(
	withAuthorization(),
)(UserPage);
