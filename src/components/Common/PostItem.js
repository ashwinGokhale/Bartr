import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { authCondition } from '../../constants';
import { deletePost } from '../../actions';

class PostItem extends Component {
	onClick = (e) => {
		this.props.deletePost(this.props.post.postId);
	}
	
	// TODO: Add ability for posts to display more pictures
	render() {
		const { post, type } = this.props;
		console.log('Post item:', post);
		return (
			<div className="placeHolder">
				<div className="postTitle">
					<h3>{post.title}</h3>
				</div>
				{
					type === 'user' ? <button onClick={this.onClick}>X</button> : null
				}
				<div className="postInfo">
					<div className="postPicture">
						<img className="itemPicture" alt="itemPicture" src={post.photoUrls[0]}></img>
					</div>
					<div className="postDescription">
						<ul className="descriptionDetails">
							{post.description}
						</ul>
					</div>
				</div>
			</div>
		)
	}
}

export default compose(
	connect(null, { deletePost })
)(PostItem);
