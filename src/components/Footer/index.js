import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as routes from '../../constants';
import React, { Component } from 'react'
import "./index.css"

export default class Footer extends Component {
  render() {
	return (
		<div className="center">
			<a className="spacing">How It Works</a>
			<a className="spacing">Team</a>
			<a className="spacing">Values</a>
			<a className="spacing">Blog</a>
			<Link to={routes.SUPPORT} style={{ textDecoration: 'none' }}><a className="spacing">Support</a></Link>
			<a className="spacing">Invite Friends</a>
			<a className="spacing">Terms</a>
			<a className="spacing">Privacy</a>
			<a className="spacing" href="mailto:BartrTradeHelp@gmail.com">Contact</a>
		</div>
	)
  }
}
