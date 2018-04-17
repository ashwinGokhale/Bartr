import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import { fetchUser, fetchPosts } from '../../actions';
import withAuthorization from '../Session/withAuthorization';
import Profile from '../Common/Profile';

class PostPage extends Component {
  constructor(props) {
    super(props);
    console.log('Post Page props', this.props);
  }

  componentWillMount = async () => {
  }

  render = () => {
      return (
          <div>Post</div>
      );
  }
}

export default compose(
  	withAuthorization((authUser) => !!authUser),
)(PostPage);
