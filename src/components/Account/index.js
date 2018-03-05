import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import axios from 'axios';
import defaultPhoto from '../../assets/default.png';
import insertHere from '../../assets/insertHere.png';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import withAuthorization from '../Session/withAuthorization';

import './account.css'

class AccountPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    // Get user's posts from DB

    this.props.user.getIdToken().then(token => {
      // Get DB user and input into Redux store
      console.log(`Getting user posts w/ user id: ${this.props.user.uid}`)
      axios.get(
        `/api/posts/user/${this.props.user.uid}`,
        {headers: {token}}
      )
      .then(response => {
        console.log(response.data);
      })
    })
  }
  
  

  render() {
    const { user } = this.props
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
              <div className="createPost">
                <div className="postUploadAccount">
                  <img className="insertHere" src={insertHere} alt="insertPictureHere.png"></img>
                  <button className="uploadPhoto">Choose A Photo</button>
                </div>
                <div className="postInformation">
                  <textarea className="titleAccount" placeholder="Add a title..."></textarea>
                  <textarea className="descriptionAccount" placeholder="Add a description..."></textarea>
                  <button className="createAccountPost">Create Post</button>
                </div>
              </div>
    
              <div className="postFeed">
                  {/* <div className="placeHolder">
                    <div className="postTitle">
                      <h3>Thermaltake View 71 RGB 4-Sided Tempered Glass</h3>
                    </div>
                    <div className="postInfo">
                      <div className="postPicture">
                        <img className="itemPicture" src="https://images10.newegg.com/NeweggImage/ProductImage/11-133-359-V01.jpg"></img>
                      </div>
                      <div className="postDescription">
                        <ul className="descriptionDetails">
                          <li>4-Sided 5mm thick Tempered Glass "Spaced" panels</li>
                          <li>Dual Swing 180 degree doors with full side panel windows</li>
                          <li>Vertical GPU Float bracket (Riser Cable Sold Separately)</li>
                          <li>Support up to 10x 2.5" SSD drives or 7x 3.5" HDD Drives</li>
                          <li>3-Way Radiator Mounting (Top, Front, Vertical Side) – Up to 420mm</li>
                          <li>Top/Front 45 degree mount I/O Panel with 2x USB 3.0/2x USB 2.0 with HD Audio</li>
                          <li><strong>THIS POST IS A STUB</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div> */}
                </div>

            </div>

            <div className="column rightCol">
              <div className="reviewPost">
                <div className="reviewCard">
                  <center><h4>Reviews</h4></center>
                  <div className="underline"></div>
                  <div className="reviewPosting">
                    <center><h8>User Name</h8></center>
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
});


export default compose(
  withAuthorization((authUser) => !!authUser),
  connect(mapStateToProps)
)(AccountPage);
