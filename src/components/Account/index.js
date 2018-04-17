import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import { CREATE_POST } from '../../constants';
import defaultPhoto from '../../assets/default.png';
import withAuthorization from '../Session/withAuthorization';
import PostItem from '../Common/PostItem';
import { fetchUserPosts, fetchDBUser } from '../../actions'
import './account.css'

class AccountPage extends React.Component {
  componentDidMount = () => this.props.fetchUserPosts();
  
  render() {
    const { dbUser, userPosts } = this.props;
    console.log('Rendering userPosts: ', userPosts)
    return (
      <div>
        <div className="row">
          <div className="column leftCol">
            <div className="profile">
              <div className="profileCard">
                <img className="profilePhoto" src={dbUser.photoUrl !== 'none' ? dbUser.photoUrl : defaultPhoto} alt="Profile Photo"></img>
                <h3 className="userName">{dbUser.displayName}</h3>
                <a href="https://docs.google.com/forms/d/e/1FAIpQLScDEeZwyH-fQiDNSUggxKMZFNPm03H9cF3IaI5uwzR7MeECkA/viewform?usp=sf_link" target="_blank"><button className="reportUser">Report A User</button></a>
              </div>
            </div>
            <Link className="createPostAccount" to={CREATE_POST}>Create Post</Link>
            <div className="bios">
              <div className="biosCard">
                <center><h4>My Info</h4></center>
                <div className="underline"></div>
                <div className="myInfo">
                  <p>Email: {dbUser.contactInfo.email}</p>
                  <p>Address: {dbUser.contactInfo.address}</p>
                  <p>Phone Number: {dbUser.contactInfo.phoneNumber}</p>
                  <p>Search Radius: {dbUser.radius} m</p>
                </div>
              </div>
            </div>
          </div>
          <div className="column centerCol">
            <div className="postFeed">
              {
                userPosts &&
                userPosts.length ?
                userPosts.map((post,i) => <PostItem key={i} id={post.postId} type="user" post={post}/>) :
                <div className="ghostPlaceHolder">
                <div className="ghostTitle">
                    <h3 className="ghostText">You have no active posts.</h3>
                </div>
              </div>
              }
            </div>
          </div>

          <div className="column rightCol">
            <div className="reviewPost">
              <div className="reviewCard">
                <center><h4>Rating</h4></center>
                <div className="underline"></div>
                <div className="ratingInfo">
                  <p className="accountRatingTitle">User Rating</p>
                  <div className="star-ratings-css">
                    <div className="star-ratings-css-top" style={{width: ((dbUser.totalRatings / dbUser.numRatings) * 20) + '%'}}><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
                    <div className="star-ratings-css-bottom"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
                  </div>
                  <p className="accountRatingDescription">{dbUser.totalRatings / dbUser.numRatings} average based on {dbUser.numRatings} reviews.</p>
                </div>
              </div>
            </div>
          </div>  
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  dbUser: state.sessionState.dbUser,
  userPosts: state.postsState.userPosts,
});

export default compose(
  withAuthorization((authUser) => !!authUser),
  connect(mapStateToProps, { fetchUserPosts, fetchDBUser })
)(AccountPage);
