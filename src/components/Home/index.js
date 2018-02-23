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
	
	this.props.user.getIdToken().then(token => {
		console.log(token)
		axios.get(
			`/api/users/${this.props.user.uid}`,
			{headers: {token}}
		)
		.then(response => onSetUser(response.data))
	})
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
