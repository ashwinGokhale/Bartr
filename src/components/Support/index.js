import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import { VERIFICATION_PAGE } from '../../constants';
import defaultPhoto from '../../assets/default.png';
import insertHere from '../../assets/insertHere.png';
import withAuthorization from '../Session/withAuthorization';
import PostItem from '../Common/PostItem';
import { fetchFeedPosts, fetchDBUser } from '../../actions';

import './index.css';

class SupportPage extends Component {
  constructor(props) {
    super(props);
  }
  
  componentDidMount = () => {
    this.props.fetchFeedPosts();
  }

  render() {
    const { dbUser, feedPosts } = this.props;

    console.log('Rendering feed posts:', feedPosts)

    return (
      <div>
        <div className="textfieldSupport">
          <div className="headerSupport"> Support </div>
          <div className="textBoxSupport">
              <h2> The 24/7 Bartr support team may be reached at <a href="mailto:BartrTradeHelp@gmail.com">BartrTradeHelp@gmail.com</a> and 
                  will promptly respond to your email. If you need to report a user click <a href="https://docs.google.com/forms/d/e/1FAIpQLScDEeZwyH-fQiDNSUggxKMZFNPm03H9cF3IaI5uwzR7MeECkA/viewform?usp=sf_link" target="_blank">here</a>
              </h2>
              <div className="headerFrequent"> Frequently Asked Questions </div>
              <div className="FAQ">
                <h1> Is Bartr free? </h1>
                <div className="answerText"> YES! Bartr is completely free to use for all members. </div>
                <h1> What services and goods are on Bartr? </h1>
                <div className="answerText"> There is a list of goods and services as far as the eye can see! 
                                            Services range widely from car oil changes and computer repair all the way to goods like a nice home cooked meal.
                                            Use our search bar to find a good or service that may interest you. </div>
                <h1> Is there Bartr based currency? </h1>
                <div className="answerText"> No, we realize many users do not like the idea of having to buy in store credit to use on a site and neither do we.
                                            Our website is purely based on bartering for a good or service. </div>
                <h1> Whats the catch? </h1>
                <div className="answerText"> No catch at all, the Bartr website is completely free to use, so go ahead and create your account today! </div>

                <h1> How do I get verified? </h1>
                <div className="answerText">If you would like to become verified barterer on Bartr, you will have to fill out the <Link to={VERIFICATION_PAGE}>verification application</Link>.
                     We will verify your previous transactions and your user ratings to determine if you are eligible to be verified.</div>
              </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  dbUser: state.sessionState.dbUser,
  feedPosts: state.postsState.feedPosts
});

export default compose(
  withAuthorization((authUser) => !!authUser),
  connect(mapStateToProps, { fetchFeedPosts, fetchDBUser })
)(SupportPage);