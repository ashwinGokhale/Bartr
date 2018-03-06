import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import axios from 'axios';
import defaultPhoto from '../../assets/default.png';
import insertHere from '../../assets/insertHere.png';
import withAuthorization from '../Session/withAuthorization';
import PostItem from '../Common/PostItem';

import './index.css';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dbUser: this.props.dbUser,
      feedPosts: this.props.feedPosts
    }
  }
  
  componentDidMount() {
    const { onSetDBUser, onSetPosts, _geoloc, radius } = this.props;
	
    this.props.user.getIdToken().then(token => {
      // Get DB user and update Redux store
      axios.get(
        `/api/users/${this.props.user.uid}`,
        {headers: {token}}
      )
      .then(response => {
        this.setState({ dbUser: response.data })
        onSetDBUser(response.data)
      })

      // Geo query posts and updated Redux store
      axios.get(
        `/api/posts/geo`,
        {
          headers: {token},
          params: {
            lat: _geoloc.lat,
            lng: _geoloc.lng,
            radius
          }
        }
      )
      .then(response => {
        console.log('Got feed posts:', response.data);
        this.setState({ feedPosts: response.data })
        onSetPosts(response.data)
      })
    })
  }

  render() {
    const { dbUser, feedPosts } = this.state;

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
              {feedPosts.map((post,i) => <PostItem key={i} post={post}/>)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.sessionState.authUser,
  dbUser: state.sessionState.dbUser,
  _geoloc: state.settingsState._geoloc,
  radius: state.settingsState.radius,
  feedPosts: state.postsState.feedPosts
});

const mapDispatchToProps = (dispatch) => ({
  onSetDBUser: (user) => dispatch({ type: 'DB_USER_SET', user }),
  onSetPosts: (feedPosts) => dispatch({ type: 'FEED_POSTS_SET', feedPosts })
});

export default compose(
  withAuthorization((authUser) => !!authUser),
  connect(mapStateToProps, mapDispatchToProps)
)(HomePage);
