import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PostItem from '../Common/PostItem';
import { createRating } from '../../actions';
// import Rating from './Rating';
import defaultPhoto from '../../assets/default.png';
import './profile.css'

export default class Profile extends Component {
	starHandler = async (e, num) => {
		console.log('Value:', e.target.value);
		console.log('Num:', num);
		// console.log('Creating Rating:', {
		// 	raterID: this.props.currentUser,
		// 	userID: this.props.dbUser.uid,
		// 	value: num
		// });
		// console.log(this.props.authUser.uid);
		const data = await createRating(this.props.dbUser.uid, num);
		console.log(data);
	}

	Rating = () =>
		<div>
			<h1 className="ratingTitle">Rating</h1>
			<fieldset className="rating">
				{[5,4,3,2,1].map((num, i) => [
					<input
						onClick={e => this.starHandler(e, num)}
						type="radio"
						id={`star${num}`}
						name="rating"
						value={num}
						key={`in-star${num}`}
					/>,
					<label 
						className="full" 
						htmlFor={`star${num}`}
						key={`lab-star${num}`}
					/>,
					<input 
						onClick={e => this.starHandler(e, num-0.5)} 
						type="radio" 
						id={`star${num}half`}
						name="rating" 
						value={`${num-1} and a half`}
						key={`in-star${num}half`}
					/>,
					<label 
						className="half" 
						htmlFor={`star${num}half`}
						key={`star${num}half`}
					/>
				])}
			</fieldset>
		</div>

  render() {
	const { dbUser, feedPosts, currentUser } = this.props;
	console.log('Profile Props:', this.props);
	return (
		<div>
			<div className="row">
				<div className="column leftSide">
					<div className="profile">
					<div className="profileCard">

						<img className="profilePhoto" src={dbUser ? dbUser.photoUrl : defaultPhoto} onError={(e)=>{e.target.src=defaultPhoto}}></img>
						{ !!dbUser && <h5 className="userName">{dbUser.displayName}</h5> }
						{ !currentUser && <this.Rating/>}
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

