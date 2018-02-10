import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router';

class Home extends React.Component {
	componentWillMount(){
		fetch('/api/news')
		.then(resp => resp.json())
		.then(data => console.log(`Seeing this means that the API is working: ${data}`));
	}

	render() {
		return (
			<div>
				<h1>Home</h1>
				<Link to='/login'>Login</Link> <Link to='/register'>Register</Link>
			</div>
		)
	}
}

export default connect()(Home);
