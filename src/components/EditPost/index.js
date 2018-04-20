import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { fetchUserPosts, fetchPost, fetchTrades, editPost } from '../../actions';
import withAuthorization from '../Session/withAuthorization';
import { PostCardEdit } from '../Common';

class EditPostPage extends Component {
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
    await this.props.fetchTrades();
    try {
      const post = await fetchPost(id);
      post.tags = post.tags.map((tag, i) => ({id: i+1, text: tag}));
      console.log('EditPage post data:', post);
      this.setState({post});
    } catch (error) {
      console.error('Error fetching post:', id);
      console.error(error);
    }
  }


	onChange = (e) => {
		e.preventDefault();
		if (e.target.id === 'photos') {
			this.setState({photos: e.target.files})
			var x = document.getElementById("uploads");
			if(e.target.files.length >= 2) {
				x.innerHTML = e.target.files.length + " files";
			} else {
				x.innerHTML = e.target.files[0].name
			}
		}
		else
			this.setState({[e.target.id] : e.target.value})
	}

  render = () => 
    this.state.post ?
      <PostCardEdit post={this.state.post} userPosts={this.props.userPosts} self={this.props.authUser.uid === this.state.post.userId}/> :
      <div>Loading...</div>
}

const mapStateToProps = (state) => ({
  userPosts: state.postsState.userPosts,
});

export default compose(
  withAuthorization(),
  connect(mapStateToProps, { fetchUserPosts, fetchTrades })
)(EditPostPage);