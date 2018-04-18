import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Link, withRouter } from 'react-router-dom';
import defaultPhoto from '../../assets/default.png';
import insertHere from '../../assets/insertHere.png';
import withAuthorization from '../Session/withAuthorization';
import PostItem from '../Common/PostItem';
import { fetchFeedPosts, fetchDBUser } from '../../actions';
import { updateVerified } from '../../actions';

import './index.css';

class VerificationPage extends Component {
  constructor(props) {
    super(props);
    this.state={
      verified: false
    }
  }
  
  //componentDidMount = () => {
  //  this.props.fetchFeedPosts();
  //}

  render() {
      const { verified } = this.state;
      const { dbUser } = this.props;
      return (
      <div>
        
        <div className="textfieldSupport">
          <div className="headerSupport"> Why get verified? </div>
            <div className="textBoxSupport">
                <h2>
                  At Bartr we take pride in making sure our users uphold their transactions, and maintain a high quality of service.
                  A verified Bartr account shows that a user is a reliable person to barter with. We verify our members by analyzing
                  their rating, amount of transactions they have made, and the quality of service. If you would like to be considered
                  for a verified Bartr account please click the apply button below. If you are verified you will recieve a Bartr symbol
                  by your profile name.
                </h2>
                <br></br>
                <button className="submit" onClick={e => this.props.updateVerified({
                  verified: verified
                })}>Apply to be verified</button>
            </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store) => ({
  authUser: store.sessionState.authUser,
});

export default compose(
  withRouter,
  connect(mapStateToProps, { updateVerified })
)(VerificationPage);