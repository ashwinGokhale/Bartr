import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import { CREATE_POST } from '../../constants';
import defaultPhoto from '../../assets/default.png';
import withAuthorization from '../Session/withAuthorization';
import PostItem from '../Common/PostItem';
import { fetchFeedPosts, fetchDBUser } from '../../actions';

class OffersPage extends Component {
  componentDidMount = () => {}

  render() {
    return (
      <div>
        <h3>New Offers:</h3>
        
        <h3>Accepted Trades:</h3>
        
        <h3>Completed Trades:</h3>
        
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  dbUser: state.sessionState.dbUser,
  feedPosts: state.postsState.feedPosts
});

export default compose(
  withAuthorization(),
  connect(mapStateToProps, { fetchFeedPosts, fetchDBUser })
)(OffersPage);
