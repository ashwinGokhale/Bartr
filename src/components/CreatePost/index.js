import React, { Component } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import withAuthorization from '../Session/withAuthorization';
import { authCondition } from '../../constants';
import { updateDBUser } from '../../actions';
import axios from 'axios';
import insertHere from '../../assets/insertHere.png';
import './index.css'

class CreatePostPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tags: [],
			description: '',
			title: '',
			lat: 0,
			lat: 0,
			radius: 0,
			photos: [],
			currentLocation: true,
			address: '',
			error: null
		}
	}

	onChange = (e) => {
		e.preventDefault();
		if (e.target.id === 'photos')
			this.setState({photos: e.target.files})
		else
			this.setState({[e.target.id] : e.target.value})
	}

	getCurrentPosition = (options = {}) => new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, options));

	onSubmit = async (e) => {
		e.preventDefault();
		if (!this.state.description.length)
			return this.setState({ error: 'Post must have a description' })
		if (!this.state.title.length)
			return this.setState({ error: 'Post must have a title' })
		
		let data = new FormData();
		let position;

		if (this.state.currentLocation) {
			if (!navigator.geolocation)
				return this.setState({ error: 'Please give permission to use your current location' })
			
			try {
				position = await this.getCurrentPosition();
				const { latitude, longitude } = position.coords;
				data.append('_geoloc', {
					lat: latitude,
					lng: longitude
				});
				this.props.updateDBUser({lat: latitude, lng: longitude})
			} catch (error) {
				console.error(error)
				return this.setState({error: 'Current location error'})
			}
		}
		else {
			if (!this.state.address.length)
				return this.setState({ error: 'Post must have an address' })
			else
				data.append('address', this.state.address)
		}

		try {
			data.append('photos', this.state.photos);
			data.append('tags', this.state.tags.map(tag => tag.text));
			data.append('title', this.state.title);
			data.append('description', this.state.description);
			const resp = await axios.post('/api/posts/test', data, {
				headers: {
					'content-type': 'multipart/form-data'
				}
			})
			console.log(resp.data)	
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
		
		// TODO: Add uploading of multiple photos
		return (
			<form onSubmit={this.onSubmit} encType="multipart/form-data" className="createPost">
				<div className="postUploadAccount">
					<label>Add photos</label>
					<img className="insertHere" src={insertHere} alt="insertPictureHere.png"></img>
					<input type="file" className="uploadPhoto" placeholder="Choose A Photo" id="photos" onChange={this.onChange} multiple />
				</div>
				<div className="postInformation">
					<div className="warningForm">
						{ !!this.state.error ? <p className="warning" style={{'color': 'red'}}>ERROR: {this.state.error}</p> : null }
					</div>
					<ReactTags 
						tags={this.state.tags}
						handleDelete={this.handleDelete}
						handleAddition={this.handleAddition}
						handleDrag={this.handleDrag} 
					/>
					<label>Title</label>
					<input className="titleAccount" placeholder="Add a title..." id="title" onChange={this.onChange} /><br/>
					<label>Description</label><br/>
					<textarea className="descriptionAccount" cols="86" rows ="10" placeholder="Add a description..." id="description" onChange={this.onChange} />
					<br/>

					<label>Current Location</label>
					<input type="radio" name="location" onChange={(e) => {this.setState({currentLocation: true})}} />
					<label>Address</label>
					<input type="radio" name="location" onChange={(e) => {this.setState({currentLocation: false})}} />
					<br/>
					{
						!this.state.currentLocation ?
							<input id="address" onChange={this.onChange} /> : 
							null
					}

					<input type="submit" className="createAccountPost" value="Create Post"/>
				</div>
			</form>
		)
	}
}


const mapStateToProps = (state) => ({
	...state.sessionState.dbUser,
	dbUser: state.sessionState.dbUser
});

export default compose(
  	withAuthorization(authCondition),
	connect(mapStateToProps, { updateDBUser })
)(CreatePostPage);