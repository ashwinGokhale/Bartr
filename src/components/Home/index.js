import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import axios from 'axios';
import defaultPhoto from '../../assets/default.png';
import insertHere from '../../assets/insertHere.png';
import './index.css';

import withAuthorization from '../Session/withAuthorization';

class HomePage extends Component {
  componentDidMount() {
    const { onSetUser } = this.props;
    axios.get('/API/users/${this.props.user.uid}')
      .then(response => onSetUser(response.data))
  }

  render() {
    const { user } = this.props;

    return (
      <div>
        <div className="row">
          <div className="column leftSide">
            <div className="profile">
              <div className="profileCard">
                <img className="profilePhoto" src={defaultPhoto} alt="goodsForGoods.png"></img>
                { !!user && <UserList user={user} /> }
                <h5 className="rating">-----rating is future sprint-----</h5>
              </div>
            </div>
            <div className="filters">
              <div className="filtersCard">
                <h4>Filters</h4>
                <hr></hr>
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
              <div className="placeHolder">
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
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

const UserList = ({ user }) =>
  <div>
    <h5 className="userName">{user.email}</h5>
  </div>

const mapStateToProps = (state) => ({
  user: state.sessionState.authUser,
});

const mapDispatchToProps = (dispatch) => ({
  onSetUser: (user) => dispatch({ type: 'USERS_SET', user }),
});

export default compose(
  withAuthorization((authUser) => !!authUser),
  connect(mapStateToProps, mapDispatchToProps)
)(HomePage);
