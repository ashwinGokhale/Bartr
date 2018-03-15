import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import * as routes from '../../constants';
export default class SignUpLink extends Component {
	render() {
		return (
			<div>
				<div>
					Don't have an account?
					{' '}
					<Link className="formats" to={routes.SIGN_UP}>Sign Up</Link>
				</div>
			</div>
		)
	}
}