import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import withAuthorization from '../Session/withAuthorization';
import { authCondition } from '../../constants'
import { auth } from '../../firebase';
import axios from 'axios';

class SettingsPage extends Component {
	constructor(props) {
		super(props);
		console.log('Props: ', this.props);
		this.state = { 
			_geoloc: this.props._geoloc,
			radius: this.props.radius,
			error: null
		}
		console.log('State:', this.state);
		console.log('User ID:', auth.currentUser.uid)
	}

	isRadiusValid = value => (value > 50 || value < 5) ? false : true
	isLatitudeValid = value => (value > 90 || value < -90) ? false : true
	isLongitudeValid = value => (value > 180 || value < -180) ? false : true
	validateAll = (event) => {
		let valid = true;
			// Validate latitude, longitude, and radius
			if (!this.isRadiusValid(this.state.radius)) {
				this.setState({ error: 'Radius must be <= 50 and >= 0'});
				valid = false;
			}
			
			if (!this.isLatitudeValid(this.state._geoloc.lat)) {
				this.setState({ error: 'Latitude must be <= 90 and >= -90'});
				valid = false;
			}
			
			if (!this.isLongitudeValid(this.state._geoloc.lng)) {
				this.setState({ error: 'Latitude must be <= 180 and >= -180'});
				valid = false;
			}
					
			if (valid) this.setState({ error: null })
	}
	

	onChange = (event) => {
		event.preventDefault();

		if (event.target.name === 'radius')
			this.setState({ radius: event.target.value }, () => this.validateAll(event))
		else if (event.target.name === 'lat')
			this.setState({ _geoloc: {...this.state._geoloc, lat: event.target.value} }, () => this.validateAll(event))
		else
		this.setState({ _geoloc: {...this.state._geoloc, lng: event.target.value} }, () => this.validateAll(event))

		if (event.target.name === 'radius') this.props.onSetRadius(this.state.radius)
		else this.props.onSetGeoLoc(this.state._geoloc)
	}

	onSubmit = (event) => {
		event.preventDefault();
		if (this.isRadiusValid(this.state.radius) && this.isLatitudeValid(this.state._geoloc.lat) && this.isLongitudeValid(this.state._geoloc.lng)) {
			console.log(this.props.authUser)
			const { _geoloc, radius } = this.state;
			
			axios.post(`/api/users/${this.props.authUser.uid}`, {
				_geoloc,
				radius
			})
			.then(response => console.log(response.data))
			.catch(error => console.error(error))

		}
	}
	

  render() {
		console.log('State:', this.state)
		const { radius, error } = this.state;
		const { lat, lng } = this.state._geoloc;
    return (
      <div>
        <h1>Settings</h1>
        <h4>Change Settings</h4>
				{ !!error ? <p style={{'color': 'red'}}>ERROR: {error}</p> : null }
				<p>Latitude:  {lat}</p>
				<p>Set Latitude: </p><input type='number' name='lat' onChange={this.onChange.bind(this)} />
				<p>Longitutde:  {lng}</p>
				<p>Set Longitutde: </p><input type='number' name='lng' onChange={this.onChange.bind(this)} />
				<br/>
				<p>Radius: {radius}</p>

				<p>Set Radius: </p><input type='number' name='radius' onChange={this.onChange.bind(this)} />
				<br/>
				<input type='submit' name='submit' onClick={this.onSubmit} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
	_geoloc: state.settingsState._geoloc,
	radius: state.settingsState.radius,
	authUser: state.sessionState.authUser
});

const mapDispatchToProps = (dispatch) => ({
	onSetGeoLoc: (_geoloc) => dispatch({ type: 'GEOLOC_SET', _geoloc }),
	onSetRadius: (radius) => dispatch({ type: 'RADIUS_SET', radius })
});

export default compose(
  withAuthorization(authCondition),
  connect(mapStateToProps, mapDispatchToProps)
)(SettingsPage);