import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import axios from 'axios';
import defaultPhoto from '../../assets/default.png';
import insertHere from '../../assets/insertHere.png';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import withAuthorization from '../Session/withAuthorization';
import PostItem from '../Common/PostItem';
import './account.css'

class AccountPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userPosts: this.props.userPosts
    }
  }

  componentDidMount = () => {
    const { onSetPosts } = this.props;
    // Get user's posts from DB
    this.props.user.getIdToken().then(token => {
      // Get DB user and input into Redux store
      console.log(`Getting user posts w/ user id: ${this.props.user.uid}`)
      axios.get(
        `/api/posts/user/${this.props.user.uid}`,
        {headers: {token}}
      )
      .then(response => {
        console.log('Got user posts:', response.data);
        this.setState({ userPosts: response.data })
        onSetPosts(response.data)
      })
    })
  }
  
  

  render() {
    const { user } = this.props;
    const { userPosts } = this.state;
    console.log('Rendering userPosts: ', userPosts)
    return (
      <div>
        <div>
          <div className="row">
            <div className="column leftCol">
              <div className="profile">
                <div className="profileCard">
                  <img className="profilePhoto" src={defaultPhoto} alt="goodsForGoods.png"></img>
                  <h3 className="accountName">{user.email}</h3>
                  <h5 className="rating">-----rating is future sprint-----</h5>
                  <a href="https://docs.google.com/forms/d/e/1FAIpQLScDEeZwyH-fQiDNSUggxKMZFNPm03H9cF3IaI5uwzR7MeECkA/viewform?usp=sf_link"><button className="reportUser">report</button></a>
                </div>
              </div>
              <div className="bios">
                <div className="biosCard">
                  <center><h4>About Me</h4></center>
                  <div className="underline"></div>
                </div>
              </div>
            </div>
            <div className="column centerCol">
              <div className="postFeed">
                {userPosts.map((post,i) => <PostItem key={i} post={post}/>)}
              </div>
            </div>

            <div className="column rightCol">
              <div className="reviewPost">
                <div className="reviewCard">
                  <center><h4>Reviews</h4></center>
                  <div className="underline"></div>
                  <div className="reviewPosting">
                    <center><h5>User Name</h5></center>
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
  user: state.sessionState.authUser,
  userPosts: state.postsState.userPosts,
});

const mapDispatchToProps = (dispatch) => ({
  onSetPosts: (userPosts) => dispatch({ type: 'USER_POSTS_SET', userPosts })
});

export default compose(
  withAuthorization((authUser) => !!authUser),
  connect(mapStateToProps, mapDispatchToProps)
)(AccountPage);
