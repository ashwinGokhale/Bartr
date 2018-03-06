import React, { Component } from 'react'

export default class CreatePost extends Component {
	render() {
		return (
			<div className="createPost">
				<div className="postUploadAccount">
					<img className="insertHere" src={insertHere} alt="insertPictureHere.png"></img>
					<button className="uploadPhoto">Choose A Photo</button>
				</div>
				<div className="postInformation">
					<textarea className="titleAccount" placeholder="Add a title..."></textarea>
					<textarea className="descriptionAccount" placeholder="Add a description..."></textarea>
					<button className="createAccountPost">Create Post</button>
				</div>
			</div>
		)
	}
}
