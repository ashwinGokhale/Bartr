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

const AccountPage = ({ authUser }) =>
  <div>
    <div>
      <div className="row">
        <div className="column leftSide">
          <div className="profile">
            <div className="profileCard">
              <img className="profilePhoto" src={defaultPhoto} alt="goodsForGoods.png"></img>
              <h3 className="accountName">Account: {authUser.email}</h3>
              <h5 className="rating">-----rating is future sprint-----</h5>
            </div>
          </div>
          <div className="bios">
            <div className="biosCard">
              <center><h4>About Me</h4></center>
              <div className="underline"></div>
            </div>
          </div>
        </div>
        <div className="column rightSide">
          <div className="createPost">
            <div className="postUpload">
              <img className="insertHere" src={insertHere} alt="insertPictureHere.png"></img>
              <button className="uploadPhoto">Choose A Photo</button>
            </div>
            <div className="postInformation">
              <textarea className="title" placeholder="Add a title..."></textarea>
              <textarea className="description" placeholder="Add a description..."></textarea>
              <button className="create">Create Post</button>
            </div>

          </div>
          <div className="postFeed">

          </div>

        </div>
        <div className="reviewPost">
          
        </div>
      </div>
    </div>
  </div>

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
});


export default compose(
  withAuthorization((authUser) => !!authUser),
  connect(mapStateToProps)
)(AccountPage);
