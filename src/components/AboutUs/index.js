import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import defaultPhoto from '../../assets/default.png';
import insertHere from '../../assets/insertHere.png';
import withAuthorization from '../Session/withAuthorization';
import PostItem from '../Common/PostItem';
import { fetchFeedPosts, fetchDBUser } from '../../actions';
import './index.css';

class AboutUsPage extends Component {
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
        <div className="textfieldAbout">
          <div className="headerAbout"> About Us </div>
          <div className="textBoxAbout">
              <h2> Founded in 2018, Bartr was originally intended to serve customers of the West Lafayette, Indiana area. Bartr focuses on trading and bartering 
                  in small communities. As college students ourselves, we realize how tight finances may be for many students. That is why we set out to create
                  a web based application that people within a community can use to trade a service for a product or vice versa. Bartr is completely free to use 
                  and was designed to not allow for use of monetary transactions. The Bartr team is highly dedicated to the user's experience and therefore we 
                  host our own support team with 24/7 service to help users with any questions or concerns they may have. 
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
)(AboutUsPage);