import { Link } from 'react-router-dom';
import * as routes from '../../constants';
import React from 'react';
import "./index.css"

export default () => 
	<div className="center">
		<Link to={routes.ABOUTUS} className="spacing" id="aboutLink" style={{ textDecoration: 'none' }}>About Us</Link>
		<Link to={routes.SUPPORT} className="spacing" id="supportLink" style={{ textDecoration: 'none' }}>Support</Link>
		<Link to={routes.TERMS} className="spacing" id="termsLink" style={{ textDecoration: 'none' }}>Terms of Use</Link>
		<a className="contactButton" href="mailto:BartrTradeHelp@gmail.com">Contact</a>
	</div>