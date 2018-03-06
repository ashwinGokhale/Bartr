import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import withAuthorization from '../Session/withAuthorization';
import { authCondition } from '../../constants'
import { auth } from '../../firebase';
import axios from 'axios';
import './index.css'

class SettingsPage extends Component {
	constructor(props) {
		super(props);
		console.log('Props: ', this.props);
		this.onChange = this.onChange.bind(this);
		this.state = { 
			_geoloc: this.props._geoloc,
			radius: this.props.radius,
			error: null,
			dbUser: this.props.dbUser,

			displayName: '',
			photoUrl: '',
			address: '',
			email: '',
			phoneNumber: ''
		}
		// console.log('State:', this.state);
		// console.log('User ID:', auth.currentUser.uid)
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
			} else if(!this.invalidChars(this.state.radius)) {
				this.setState({error: 'Radius isn\'t formatted correctly'});
				valid = false;
			}
			
			if (!this.isLatitudeValid(this.state._geoloc.lat)) {
				this.setState({ error: 'Latitude must be <= 90 and >= -90'});
				valid = false;
			} else if(!this.invalidChars(this.state._geoloc.lat)) {
				this.setState({error: 'Latitutde isn\'t formatted correcty'});
				valid = false;
			}
			
			if (!this.isLongitudeValid(this.state._geoloc.lng)) {
				this.setState({ error: 'Longitude must be <= 180 and >= -180'});
				valid = false;
			} else if(!this.invalidChars(this.state._geoloc.lng)) {
				this.setState({error: 'Longitude isn\'t formatted correctly'});
				valid = false;
			}
					
			if (valid) this.setState({ error: null })
	}
	

	onChange = (event) => {
		event.preventDefault();

		if(event.target.id === 'displayName') {
			this.setState({ displayName: event.target.textContent});
		} else if(event.target.id === 'photoUrl') {
			this.setState({ photoUrl: event.target.textContent});
		} else if(event.target.id === 'address') {
			this.setState({ address: event.target.textContent});
		} else if(event.target.id === 'email') {
			this.setState({ email: event.target.textContent});
		} else if(event.target.id === 'phoneNumber') {
			this.setState({ phoneNumber: event.target.textContent});
		}

		if (event.target.id === 'radius') {
			this.setState({ radius: event.target.textContent }, () => this.validateAll(event));
		} else if (event.target.id === 'lat') {
			this.setState({ _geoloc: {...this.state._geoloc, lat: event.target.textContent} }, () => this.validateAll(event));
		} else if(event.target.id === 'lng') {
			this.setState({ _geoloc: {...this.state._geoloc, lng: event.target.textContent} }, () => this.validateAll(event));
		}

		if (event.target.id === 'radius') this.props.onSetRadius(this.state.radius)
		else this.props.onSetGeoLoc(this.state._geoloc)
	}

	onSubmit = (event) => {
		event.preventDefault();
		if (this.isRadiusValid(this.state.radius) && this.isLatitudeValid(this.state._geoloc.lat) && this.isLongitudeValid(this.state._geoloc.lng)) {
			const { _geoloc, radius, displayName, photoUrl, address, email, phoneNumber } = this.state;
			this.props.onSetGeoLoc(this.state._geoloc);
			this.props.onSetRadius(this.state.radius);
			
			axios.post(`/api/users/${this.props.authUser.uid}`, {
				_geoloc,
				radius,
				displayName,
				photoUrl,
				address,
				email,
				phoneNumber
			})
			.then(response => console.log(response.data))
			.catch(error => console.error(error))
		}
	}

	clearFixLat() {
		document.getElementById("lat").textContent = '';
	}

	clearFixLng() {
		document.getElementById("lng").textContent = '';
	}

	clearFixRadius() {
		document.getElementById("radius").textContent = '';
	}
	
	componentDidMount() {
		const { onSetDBUser } = this.props;
		this.props.user.getIdToken().then(token => {
		  axios.get(
			`/api/users/${this.props.user.uid}`,
			{
			  headers: {
				token
			  }
			}
		  )
		  .then(response => {
			this.setState({ dbUser: response.data })
			onSetDBUser(response.data)
		  })
		})
	}

  render() {
		const { radius, error, dbUser } = this.state;
		const { lat, lng } = this.state._geoloc;
    return (
      <div>
				<div className="background">
					<div className="settingsForm">
						<h4>Account Settings</h4>
						<hr></hr>
						<div className="columnLeft">
							<p className="label">Display Name</p>
							<p className="label">Photo URL</p>
							<p className="label">Address</p>
							<p className="label">Email</p>
							<p className="label">Phone Number</p>
							<p className="label">Latitude</p>
							<p className="label">Longitude</p>
							<p className="label">Radius</p>
						</div>
						<div className="columnRight">
							<div contenteditable="true" spellCheck="false" className="align" type="text" id="displayName" onInput={this.onChange.bind(this)}>{ !!dbUser && <DisplayName user={dbUser} /> }</div>
							<div contenteditable="true" spellCheck="false" className="align" type="text" id="photoUrl" onInput={this.onChange.bind(this)}>{ !!dbUser && <PhotoUrl user={dbUser} /> }</div>
							<div contenteditable="true" spellCheck="false" className="align" type="text" id="address" onInput={this.onChange.bind(this)}>{ !!dbUser && <Address user={dbUser} /> }</div>
							<div contenteditable="true" spellCheck="false" className="align" type="text" id="email" onInput={this.onChange.bind(this)}>{ !!dbUser && <Email user={dbUser} /> }</div>
							<div contenteditable="true" spellCheck="false" className="align" type="text" id="phoneNumber" onInput={this.onChange.bind(this)}>{ !!dbUser && <PhoneNumber user={dbUser} /> }</div>
							<div contenteditable="true" spellCheck="false" className="align" type="text" id="lat" onFocus={this.clearFixLat.bind(this)} onInput={this.onChange.bind(this)}>{<Latitude latitude={lat}/>}</div>
							<div contenteditable="true" spellCheck="false" className="align" type="text" id="lng" onFocus={this.clearFixLng.bind(this)} onInput={this.onChange.bind(this)}><p>{lng}</p></div>
							<div contenteditable="true" spellCheck="false" className="align" type="text" id="radius" onFocus={this.clearFixRadius.bind(this)} onInput={this.onChange.bind(this)}><p>{radius}</p></div>
						</div>
						<div className="warningForm">
							{ !!error ? <p className="warning" style={{'color': 'red'}}>ERROR: {error}</p> : null }
						</div>
						<input className="submit" type='submit' name='submit' value='Update' onClick={this.onSubmit.bind(this)} />
					</div>
				</div>
      </div>
    );
  }
}

const DisplayName = ({ user }) => {
	return (
			<p>{user.displayName}</p>
	)
}

const PhotoUrl = ({ user }) => {
	return (
	  <p>{user.photoUrl}</p>
	)
}

const Address = ({ user }) => {
	return (
	  <p>{user.contactInfo.address}</p>
	)
}

const Email = ({ user }) => {
	return (
	  <p>{user.contactInfo.email}</p>
	)
}

const PhoneNumber = ({ user }) => {
	return (
	  <p>{user.contactInfo.phoneNumber}</p>
	)
}

const Latitude = ({latitude}) => {
	return (
		<p>{latitude}</p>
	)
}

const mapStateToProps = (state) => ({
	_geoloc: state.settingsState._geoloc,
	radius: state.settingsState.radius,
	user: state.sessionState.authUser,
	dbUser: state.sessionState.dbUser
});

const mapDispatchToProps = (dispatch) => ({
	onSetGeoLoc: (_geoloc) => dispatch({ type: 'GEOLOC_SET', _geoloc }),
	onSetRadius: (radius) => dispatch({ type: 'RADIUS_SET', radius }),
	onSetDBUser: (user) => dispatch({ type: 'DB_USER_SET', user })
});

export default compose(
  withAuthorization(authCondition),
  connect(mapStateToProps, mapDispatchToProps)
)(SettingsPage);