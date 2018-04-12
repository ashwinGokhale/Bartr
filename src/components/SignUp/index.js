import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import axios from 'axios';

import { auth } from '../../firebase';
import { setAuthUser, createUser } from '../../actions'
import * as routes from '../../constants';
import './index.css';

class SignUpPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="signUpPageBackground">
        <SignUpForm {...this.props} />
      </div>
    )
  }
  
}

const INITIAL_STATE = {
  displayName: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = async (event) => {
    event.preventDefault();
    const { displayName, email, passwordOne } = this.state;
    const { history } = this.props;
    try {
      const authUser = await auth.createUserWithEmailAndPassword(email, passwordOne)
      const token = await auth.currentUser.getIdToken();
      const data = await this.props.createUser(
        {
            uid: authUser.uid,
            displayName,
            photoUrl: authUser.photoURL || 'none',
            email
        },
        token
      )
      console.log(data)
      this.setState(() => ({ ...INITIAL_STATE }));
      history.push(routes.HOME);
    } catch (error) {
      console.error(error)
      this.setState( {error: error } );
    }
  }

  render() {
    const { displayName, email, passwordOne, passwordTwo, error } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      displayName === '' ||
      email === '';

    return (
      <div className="signUpBackground">
        <h1 className="signUpHeader">SIGN UP</h1>
        <form onSubmit={this.onSubmit}>
          <div className="signUpInfo">
            <input
              spellCheck="false"
              value={displayName}
              onChange={event => this.setState({ displayName: event.target.value})}
              type="text"
              placeholder="Full Name"
            />
            <input
              spellCheck="false"
              value={email}
              onChange={event => this.setState( {email: event.target.value} )}
              type="text"
              placeholder="Email Address"
            />
            <input
              value={passwordOne}
              onChange={event => this.setState( {passwordOne: event.target.value} )}
              type="password"
              placeholder="Password"
            />
            <input
              value={passwordTwo}
              onChange={event => this.setState( {passwordTwo: event.target.value} )}
              type="password"
              placeholder="Confirm Password"
            />
          </div>
          <div className="centerSignUp">
            <button className="signUpButton" disabled={isInvalid} type="submit">
              Sign Up
            </button>
          </div>
          { error && <p>{error.message}</p> }
        </form>
      </div>
    );
  }
}

const SignUpLink = () =>
  <div>
    <div>
      Don't have an account?
      {' '}
      <Link className="formats" to={routes.SIGN_UP}>Sign Up</Link>
    </div>
  </div>

// export default withRouter(SignUpPage);
// connect(null, { createUser })(SignUpForm)

export default compose(
  withRouter,
  connect(null, { createUser }),
)(SignUpPage);

