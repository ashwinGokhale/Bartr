import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PostItem from '../Common/PostItem';
import { createRating } from '../../actions';
import defaultPhoto from '../../assets/default.png';
import verLogo from '../../assets/bartrCircle.png'
import './profile.css'

export default class ProfilePage extends Component {
	starHandler = async (e, num) => {
		console.log('Value:', e.target.value);
		console.log('Num:', num);
		const data = await createRating(this.props.dbUser.uid, num);
		console.log(data);
	}

	Rating = () =>
		<div>
			<h1 className="ratingTitle">User Feedback</h1>
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

	Profile = ({ dbUser, feedPosts, currentUser }) => 
		<div className="row">
			<div className="column leftSide">
				<div className="profile">
				<div className="profileCard">

					<img className="profilePhoto" src={dbUser.photoUrl !== 'none' ? dbUser.photoUrl : defaultPhoto}></img>
					{ !!dbUser && <h5 className="userName">{dbUser.displayName}</h5> }
					{ dbUser.verified ? <img className="verImage" src={verLogo}></ img> : <div></div>	}
					{ !currentUser && <this.Rating/>}
				</div>
				</div>

				<div className="bios">
              		<div className="biosCard">
                		<center><h4>Info</h4></center>
                		<div className="underline"></div>
                		<div className="myInfo">
							<p>Email: {dbUser.contactInfo.email}</p>
							<p>{dbUser.contactInfo.hideAddress == false ? "Address: " + dbUser.contactInfo.address : ""}</p>
							<p>{dbUser.contactInfo.hidePhoneNumber == false ? "Phone Number: " + dbUser.contactInfo.phoneNumber : ""}</p>
                		</div>
              		</div>
            	</div>
			</div>
			<div className="column rightSide">
				<div className="postFeed">
				{
					feedPosts &&
					feedPosts.length ? 
					feedPosts.map((post,i) => <PostItem key={i} id={i} type="feed" post={post}/>) :
					<div className="ghostPlaceHolder">
                <div className="ghostTitle">
                    <h3 className="ghostText">This user has no active posts.</h3>
                </div>
              </div>
				}
				</div>
			</div>
		</div>

  render = () => this.props.dbUser ? <this.Profile {...this.props} /> : <div>Loading...</div>
}

