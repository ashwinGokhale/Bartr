import React, { Component } from "react";
import { Route, Link, Switch } from "react-router-dom";
import routes from "./routes";
import "./styles/App.css";
import 'semantic-ui-css/semantic.min.css'

class App extends Component {
  render() {
    return (
		<div>
			<nav id="mainNav" className="navbar navbar-custom">
			<div className="container">
				<div className="navbar-header">
					<Link to='/' className="navbar-brand">Home</Link>
					<Link to='/news' className="navbar-brand">News</Link>
				</div>
			</div>
			</nav>
			<Switch>
      			{routes.map((route, i) => <Route key={i} {...route} />)}
    		</Switch>
		</div>
		
    );
  }
}

export default App;
