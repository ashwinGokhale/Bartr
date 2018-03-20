import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import withAuthorization from '../Session/withAuthorization';
import { authCondition } from '../../constants';
import { updateDBUser } from '../../actions';
import './index.css'

class SettingsPage extends Component {
	constructor(props) {
		super(props);

		console.log('Props:', this.props)
		this.state = { 
			lat: this.props.lat,
			lng: this.props.lng,
			radius: this.props.radius,
			error: null,
			// dbUser: this.props.dbUser,
			photoUrl: this.props.photoUrl,
			displayName: this.props.displayName,
			contactInfo: this.props.contactInfo ||  {		
				address: '',
				phoneNumber: ''
			}
		}
	}

	invalidChars = value => (/^-?\d+(\.\d{1,6})?$/.test(value)) ? true : false
	isRadiusValid = value => (value < 5) ? false : true
	isLatitudeValid = value => (value > 90 || value < -90) ? false : true
	isLongitudeValid = value => (value > 180 || value < -180) ? false : true
	validateAll = (event) => {
		let valid = true;
			// Validate latitude, longitude, and radius
			if (!this.isRadiusValid(this.state.radius)) {
				this.setState({ error: 'Radius must be >= 5'});
				valid = false;
			}
			
			if (!this.isLatitudeValid(this.state.lat)) {
				this.setState({ error: 'Latitude must be <= 90 and >= -90'});
				valid = false;
			}
			
			if (!this.isLongitudeValid(this.state.lng)) {
				this.setState({ error: 'Longitude must be <= 180 and >= -180'});
				valid = false;
			}
					
			if (valid) this.setState({ error: null })
	}
	

	onChange = (event) => {
		event.preventDefault();

		if (event.target.id === 'radius' || event.target.id === 'lat' || event.target.id === 'lng') 
			this.setState({ [event.target.id]: event.target.value }, () => this.validateAll(event));
		else if(event.target.id === 'photoUrl' || event.target.id === 'displayName')
			this.setState({ [event.target.id]: event.target.value});
		else
			this.setState({ contactInfo: { ...this.state.contactInfo, [event.target.id]: event.target.value}});
	}

	onSubmit = (event) => {
		event.preventDefault();
		if (this.isRadiusValid(this.state.radius) && this.isLatitudeValid(this.state.lat) && this.isLongitudeValid(this.state.lng)) {
			const { lat, lng, radius, displayName, photoUrl, contactInfo: { address , phoneNumber }} = this.state;
			const { dbUser } = this.props;
			this.props.updateDBUser({
				lat: lat || dbUser.lat,
				lng: lng || dbUser.lng,
				radius: radius || dbUser.radius,
				displayName: displayName || dbUser.displayName,
				photoUrl: photoUrl || dbUser.photoUrl,
				contactInfo: {
					email: dbUser.contactInfo.email,	
					address: address || dbUser.contactInfo.address,
					phoneNumber: phoneNumber || dbUser.contactInfo.phoneNumber
				}
			})
		}
	}

	render() {
		console.log('Settings State:', this.state)
		// TODO: Make settings page an HTML Form
		return (
			<div>
				<div className="background">
					<div className="settingsForm">
						<h4>Account Settings</h4>
						<hr></hr>
						<div className="columnLeft">
							<p className="labels">Display Name</p>
							<p className="labels">Photo URL</p>
							<p className="labels">Address</p>
							<p className="labels">Phone Number</p>
							<p className="labels">Latitude</p>
							<p className="labels">Longitude</p>
							<p className="labels">Radius</p>
						</div>
						<div className="columnRight">
							<input className="align" type="text" id="displayName" onChange={this.onChange} value={this.state.displayName}/><br/>
							<input className="align" type="url" id="photoUrl" onChange={this.onChange} value={this.state.photoUrl}/><br/>
							<input className="align" type="text" id="address" onChange={this.onChange} value={this.state.contactInfo.address}/><br/>
							<input className="align" type="tel" id="phoneNumber" onChange={this.onChange} value={this.state.contactInfo.phoneNumber}/><br/>
							<input className="align" type="number" id="lat" onChange={this.onChange} value={this.state.lat}/><br/>
							<input className="align" type="number" id="lng" onChange={this.onChange} value={this.state.lng}/><br/>
							<input className="align" type="number" id="radius" onChange={this.onChange} value={this.state.radius}/>
						</div>
						<div className="warningForm">
							{ !!this.state.error ? <p className="warning" style={{'color': 'red'}}>ERROR: {this.state.error}</p> : null }
						</div>
						<input className="submit" type='submit' name='submit' value='Update' onClick={this.onSubmit.bind(this)} />
					</div>
				</div>
			</div>
		);
	}
}



const mapStateToProps = (state) => ({
	...state.sessionState.dbUser,
	dbUser: state.sessionState.dbUser
});

export default compose(
  	withAuthorization(authCondition),
	connect(mapStateToProps, { updateDBUser })
)(SettingsPage);