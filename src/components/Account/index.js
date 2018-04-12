import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import { CREATE_POST } from '../../constants';
import defaultPhoto from '../../assets/default.png';
// import { PasswordForgetForm } from '../PasswordForget';
// import PasswordChangeForm from '../PasswordChange';
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
        <div>
          <div className="row">
            <div className="column leftCol">
              <div className="profile">
                <div className="profileCard">
                  <img className="profilePhoto" src={dbUser.photoUrl} onError={(e)=>{e.target.src=defaultPhoto}}></img>
                  <h3 className="userName">{dbUser.displayName}</h3>
                  <h5 className="rating">-----rating is future sprint-----</h5>
                  <a href="https://docs.google.com/forms/d/e/1FAIpQLScDEeZwyH-fQiDNSUggxKMZFNPm03H9cF3IaI5uwzR7MeECkA/viewform?usp=sf_link" target="_blank"><button className="reportUser">Report A User</button></a>

                </div>
              </div>
              <Link className="createPostAccount" to={CREATE_POST}>Create Post</Link>
              <div className="bios">
                <div className="biosCard">
                  <center><h4>About Me</h4></center>
                  <div className="underline"></div>
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
                  <center><h4>Reviews</h4></center>
                  <div className="underline"></div>
                  <div className="reviewPosting">
                    <center><h5 className="reviewUserName">User Name</h5></center>
                    <textarea className="reviewDescription" placeholder="stub for user review..."></textarea>
                  </div>
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
