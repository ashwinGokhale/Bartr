import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';

import { auth } from '../../firebase';
import * as routes from '../../constants';
import './index.css';

const SignUpPage = ({ history }) =>
  <div className="signUpPageBackground">
    <h1>SignUp</h1>
    <SignUpForm history={history} />
  </div>

const updateByPropertyName = (propertyName, value) => () => ({
  [propertyName]: value,
});

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

  onSubmit = (event) => {
    const { displayName, email, passwordOne } = this.state;
    const { history } = this.props;

    auth.createUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create user in database
        axios.post(`/api/users/${authUser.uid}`, {
          uid: authUser.uid,
          displayName,
          photoUrl: authUser.photoURL || 'none',
          email
        })
          // .then(response => response.data)
          .then(() => {
            this.setState(() => ({ ...INITIAL_STATE }));
            history.push(routes.HOME);
          })
          .catch(error => {
            console.log(error)
            this.setState(updateByPropertyName('error', error));
          });

      })
      .catch(error => {
        this.setState(updateByPropertyName('error', error));
      });

    event.preventDefault();
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
        <form onSubmit={this.onSubmit}>
          <div className="signUpInfo">
            <input
              value={displayName}
              onChange={event => this.setState(updateByPropertyName('displayName', event.target.value))}
              type="text"
              placeholder="Full Name"
            />
            <input
              value={email}
              onChange={event => this.setState(updateByPropertyName('email', event.target.value))}
              type="text"
              placeholder="Email Address"
            />
            <input
              value={passwordOne}
              onChange={event => this.setState(updateByPropertyName('passwordOne', event.target.value))}
              type="password"
              placeholder="Password"
            />
            <input
              value={passwordTwo}
              onChange={event => this.setState(updateByPropertyName('passwordTwo', event.target.value))}
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
  <p>
    <div>
      Don't have an account?
      {' '}
      <Link className="formats" to={routes.SIGN_UP}>Sign Up</Link>
    </div>
  </p>

export default withRouter(SignUpPage);

export {
  SignUpForm,
  SignUpLink,
};
