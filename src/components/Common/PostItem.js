import React, { Component } from 'react'

export default class PostItem extends Component {
	constructor(props) {
		super(props);
	}

	onClick = (e) => {
		e.preventDefault();
	}
	
	// TODO: Add ability for posts to display more pictures
	render() {
		const { post, type } = this.props;
		return (
			<div className="placeHolder">
				<div className="postTitle">
					<h3>{post.title}</h3>
				</div>
				{
					type === 'user' ? <button onClick={this.onClick}>X</button> : null
				}
				{/* <button onClick={this.onClick}>X</button> */}
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
