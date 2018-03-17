import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as routes from '../../constants';
import React, { Component } from 'react'
import "./index.css"

export default class Footer extends Component {
  render() {
	return (
		<div className="center">
			<Link to={routes.ABOUTUS} style={{ textDecoration: 'none' }}><a className="spacing" id="aboutLink">About Us</a></Link>
			<Link to={routes.SUPPORT} style={{ textDecoration: 'none' }}><a className="spacing" id="supportLink">Support</a></Link>
			<Link to={routes.TERMS} style={{ textDecoration: 'none' }}><a className="spacing" id="termsLink">Terms of Use</a></Link>
			<a className="contactButton" href="mailto:BartrTradeHelp@gmail.com">Contact</a>
		</div>
	)
  }
}
