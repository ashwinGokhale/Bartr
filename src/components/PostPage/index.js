import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { fetchUserPosts, fetchPost } from '../../actions';
import withAuthorization from '../Session/withAuthorization';
import { PostCard } from '../Common';

class PostPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: null
    };
    console.log('Post Page props', this.props);
  }

  componentWillMount = async () => {
    const { id } = this.props.match.params;
    console.log('Rendering post:', id);
    await this.props.fetchUserPosts();
    try {
      const post = await fetchPost(id);
      console.log('PostPage post data:', post);
      this.setState({post});
    } catch (error) {
      console.error('Error fetching post:', id);
      console.error(error);
    }
  }

  render = () => {
    const { post } = this.state;

    return (post ? <PostCard post={post} userPosts={this.props.userPosts} self={this.props.authUser.uid === post.userId}/> : <div>Loading...</div>)
  }
}

// export default compose(
//   	withAuthorization((authUser) => !!authUser),
// )(PostPage);

const mapStateToProps = (state) => ({
  userPosts: state.postsState.userPosts,
});

export default compose(
  withAuthorization((authUser) => !!authUser),
  connect(mapStateToProps, { fetchUserPosts })
)(PostPage);