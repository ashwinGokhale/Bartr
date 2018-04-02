import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PostItem from '../Common/PostItem';
import defaultPhoto from '../../assets/default.png';

export default class Profile extends Component {
  constructor(props) {
	super(props);
	// this.state = {
	// 	dbUser: this.props.dbUser,
	// 	feedPosts: this.props.feedPosts || []
	// }
  }

  render() {
	const { dbUser, feedPosts } = this.props;
	return (
		<div>
			<div className="row">
			<div className="column leftSide">
				<div className="profile">
				<div className="profileCard">

					<img className="profilePhoto" src={dbUser ? dbUser.photoUrl : defaultPhoto} onError={(e)=>{e.target.src=defaultPhoto}}></img>
					{ !!dbUser && <h5 className="userName">{dbUser.displayName}</h5> }
					<h5 className="rating">-----rating is future sprint-----</h5>
				</div>
				</div>

			</div>
			<div className="column rightSide">
				<div className="postFeed">
				{
					feedPosts &&
					feedPosts.length ? 
					feedPosts.map((post,i) => <PostItem key={i} id={i} type="feed" post={post}/>) :
					<p>No Posts!</p>
				}
				</div>
			</div>
			</div>
		</div>
	);
  }
}
