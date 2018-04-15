import React, { Component } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import withAuthorization from '../Session/withAuthorization';
import { authCondition } from '../../constants';
import * as routes from '../../constants';
import { updateDBUser, createPost } from '../../actions';
import axios from 'axios';
import insertHere from '../../assets/insertHere.png';
import './index.css';

class CreatePostPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tags: [],
			description: '',
			title: '',
			photos: [],
			currentLocation: true,
			address: '',
			type: '',
			error: this.props.userPostsError
		}
	}

	componentWillReceiveProps(nextProps) {
		if(JSON.stringify(this.props.userPostsError) !== JSON.stringify(nextProps.userPostsError))
			this.setState({ error: nextProps.userPostsError })
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

	getCurrentPosition = (options = {}) => new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, options));

	onSubmit = async (e) => {
		e.preventDefault();
		this.setState({error: null})
		if (!this.state.description.length)
			return this.setState({ error: 'Post must have a description' })
		if (!this.state.title.length)
			return this.setState({ error: 'Post must have a title' })
		if (!this.state.photos.length)
			return this.setState({ error: 'Post must have a photo' })
		if (!this.state.type.length)
			return this.setState({ error: 'Post must be either a good or service' })
		
		console.log('State:', this.state);
		let data = new FormData();
		let position;

		if (this.state.currentLocation) {
			if (!navigator.geolocation)
				return this.setState({ error: 'Please give permission to use your current location' })
			
			try {
				position = await this.getCurrentPosition({
					enableHighAccuracy: true,
					timeout: 5000,
					maximumAge: 0
				});
				const { latitude, longitude } = position.coords;
				data.append('lat', latitude);
				data.append('lng', longitude);
				console.log('Current Location: ', latitude, longitude);
				this.props.updateDBUser({lat: latitude, lng: longitude})
			} catch (error) {
				console.error('Error:', error);
				this.setState({error: 'Could not resolve current location. Falling back to default location'});
				data.append('lat', this.props.lat);
				data.append('lng', this.props.lng);
			}
		}
		else {
			if (!this.state.address.length)
				return this.setState({ error: 'Post must have an address' })
			else
				data.append('address', this.state.address)
		}

		try {
			for (let i = 0; i < this.state.photos.length; i++)
				data.append("photos", this.state.photos[i], this.state.photos[i]['name']);
			
			data.append('tags', JSON.stringify(this.state.tags.map(tag => tag.text)));
			data.append('title', this.state.title);
			data.append('description', this.state.description);
			data.append('type', this.state.type);
			this.props.createPost(data);
		} catch (error) {
			console.error(error)
			this.setState({ error: JSON.stringify(error) })
		}
	}

	handleDelete = (i) => {
        let tags = this.state.tags;
        tags.splice(i, 1);
        this.setState({tags: tags});
    }

    handleAddition = (tag) => {
        let tags = this.state.tags;
        tags.push({
            id: tags.length + 1,
            text: tag
        });
        this.setState({tags: tags});
    }

    handleDrag = (tag, currPos, newPos) => {
        let tags = this.state.tags;

        // mutate array
        tags.splice(currPos, 1);
        tags.splice(newPos, 0, tag);

        // re-render
        this.setState({ tags: tags });
    }
	
	render() {
		return (
			<form onSubmit={this.onSubmit} encType="multipart/form-data" className="createPost">
				<div className="adjustDown"/>
				<label><strong>Title</strong></label><br />
				<input className="titleAccount" placeholder="Add a title..." id="title" onChange={this.onChange} /><br/>
				<label><strong>Description</strong></label><br/>
				<textarea className="descriptionAccount" cols="86" rows ="10" placeholder="Add a description..." id="description" onChange={this.onChange} />
				<br/>

				<label><strong>Tags</strong></label>
				<ReactTags
					tags={this.state.tags}
					handleDelete={this.handleDelete}
					handleAddition={this.handleAddition}
					handleDrag={this.handleDrag} 
				/>

				<label><strong>Photos</strong></label><br/>
				<div className="postUploadAccount">
					{/*<input type="file" className="uploadPhoto" placeholder="Choose A Photo" id="photos" onChange={this.onChange} multiple />*/}
					<label className="custom-file-upload">
    					<input type="file" className="UploadPhoto" id="photos" onChange={this.onChange} multiple/>Browse
					</label>
					<label id="uploads" className="filesUploaded"></label>
				</div>
				
				<div className="postInformation">
					<label><strong>Post Type:</strong></label>
					<label>Good</label>
					<input type="radio" name="postType" onChange={(e) => {this.setState({type: 'good'})}} />
					<label>Service</label>
					<input type="radio" name="postType" onChange={(e) => {this.setState({type: 'service'})}} />
					<br/>
					<br/>

					<label><strong>Location: </strong></label>
					<label>Current</label>
					<input type="radio" name="location" onChange={(e) => {this.setState({currentLocation: true})}} />
					<label>Address</label>
					<input type="radio" name="location" onChange={(e) => {this.setState({currentLocation: false})}} />
					
					{
						!this.state.currentLocation ?
							<input className="addressInput" id="address" onChange={this.onChange} /> : 
							null
					}

					<div className="warningForm">
						{ !!this.state.error ? <p className="warning" style={{'color': 'red'}}>ERROR: {this.state.error}</p> : null }
					</div>
					<br/>
					<input type="submit" className="createAccountPost" value="Create Post"/>
				</div>
			</form>
		)
	}
}


const mapStateToProps = (state) => ({
	...state.sessionState.dbUser,
	userPostsError: state.postsState.userPostsError
});

export default compose(
  	withAuthorization(authCondition),
	connect(mapStateToProps, { updateDBUser, createPost })
)(CreatePostPage);