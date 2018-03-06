import React, { Component } from 'react'

export default class PostItem extends Component {
	// TODO: Add ability for posts to display more pictures
	render() {
		const { post } = this.props;
		return (
			<div className="placeHolder">
				<div className="postTitle">
					<h3>{post.title}</h3>
				</div>
				<div className="postInfo">
					<div className="postPicture">
						<img className="itemPicture" src={post.picture}></img>
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
