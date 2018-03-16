import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import defaultPhoto from '../../assets/default.png';
import insertHere from '../../assets/insertHere.png';
import withAuthorization from '../Session/withAuthorization';
import PostItem from '../Common/PostItem';
import { fetchFeedPosts, fetchDBUser } from '../../actions';

import './index.css';

class TermsPage extends Component {
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
        <div className="textfield">
            <div className="headerTerms">--- Terms of Use ---</div>
            <div className="textBoxTerms">
                <h2> As a condition of use, you promise not to use the services for any purpose that
                    is unlawful or prohibited by these terms, or any other purpose not intended by Bartr.
                    You agree not to use the services: 
                </h2>

                <h2> To abuse, harass, threaten, impersonate or intimidate any person. To post any content that is obscene
                    pornographic, abusive, offensive, profane, or that infringes any rights of a person. For any purpose that is not 
                    permitted under the laws of the jurisdiction where you use the services. To post any solicitation designed to obtain
                    passwords, accounts, or any other private information of a Bartr user. To generate any spam to any user or location
                    within the Bartr website. To create multiple accounts for spamming and miss use. You will not use any robot, scraper, 
                    or other form of automated means to access the site without the our written consent. To artificially inflate or alter 
                    ratings of users' goods and services they provide. 
                </h2>
                
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
)(TermsPage);