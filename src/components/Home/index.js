import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import defaultPhoto from '../../assets/default.png';
import withAuthorization from '../Session/withAuthorization';
import PostItem from '../Common/PostItem';
import { fetchFeedPosts, fetchDBUser } from '../../actions';

import './index.css';

class HomePage extends Component {
  constructor(props) {
    super(props);
  }
  
  componentDidMount = () => {
    this.props.fetchFeedPosts();
  }

  render() {
    const { dbUser, feedPosts } = this.props;

    console.log('Rendering feed posts:', feedPosts)

    return (
      <div>
        <div className="row">
          <div className="column leftSide">
            <div className="profile">
              <div className="profileCard">
                <img className="profilePhoto" src={defaultPhoto} alt="goodsForGoods.png"></img>
                { !!dbUser && <h5 className="userName">{dbUser.displayName}</h5> }
                <h5 className="rating">-----rating is future sprint-----</h5>
              </div>
            </div>
            <div className="filters">
              <div className="filtersCard">
                <h4>Filters</h4>
                <hr></hr>
                <div className="filterItem">
                  <input type="radio" className="radio"></input>
                   <p className="radioTag">Items</p>                
                </div>
                <div className="filterItem">
                  <input type="radio" id="radioServices"></input>
                  <p className="radioTag">Services</p>
                </div>
              </div>
            </div>
          </div>
          <div className="column rightSide">
            <div className="postFeed">
              {feedPosts.length ? 
                feedPosts.map((post,i) => <PostItem key={i} id={i} type="feed" post={post}/>) :
                <p>No Posts!</p>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  dbUser: state.sessionState.dbUser,
  feedPosts: state.postsState.feedPosts
});

export default compose(
  withAuthorization((authUser) => !!authUser),
  connect(mapStateToProps, { fetchFeedPosts, fetchDBUser })
)(HomePage);
