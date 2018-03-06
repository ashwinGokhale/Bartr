import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import axios from 'axios';
import defaultPhoto from '../../assets/default.png';
import insertHere from '../../assets/insertHere.png';
import './index.css';
import withAuthorization from '../Session/withAuthorization';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dbUser: this.props.dbUser
    }
  }
  
  
  componentDidMount() {
    const { onSetDBUser } = this.props;
	
    this.props.user.getIdToken().then(token => {
      // Get DB user and input into Redux store
      axios.get(
        `/api/users/${this.props.user.uid}`,
        {headers: {token}}
      )
      .then(response => {
        this.setState({ dbUser: response.data })
        onSetDBUser(response.data)
      })
    })
  }

  render() {
    const { dbUser } = this.state;

    return (
      <div>
        <div className="row">
          <div className="column leftSide">
            <div className="profile">
              <div className="profileCard">
                <img className="profilePhoto" src={defaultPhoto} alt="goodsForGoods.png"></img>
                { !!dbUser && <UserList user={dbUser} /> }
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
              
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const UserList = ({ user }) => {
  return (
    <div>
      <h5 className="userName">{user.displayName}</h5>
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.sessionState.authUser,
  dbUser: state.sessionState.dbUser
});

const mapDispatchToProps = (dispatch) => ({
  onSetDBUser: (user) => dispatch({ type: 'DB_USER_SET', user })
});

export default compose(
  withAuthorization((authUser) => !!authUser),
  connect(mapStateToProps, mapDispatchToProps)
)(HomePage);
