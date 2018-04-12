import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

// import { SignUpLink } from '../SignUp';
import { SignUpLink } from '../Common'
import { PasswordForgetLink } from '../PasswordForget';
import { auth } from '../../firebase';
import * as routes from '../../constants';
import './index.css'

const SignInPage = ({ history }) =>
  <div className="pageBackground">
      <SignInForm history={history} />
  </div>

const updateByPropertyName = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    event.preventDefault();
    const {
      email,
      password,
    } = this.state;

    const {
      history,
    } = this.props;

    auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
        history.push(routes.HOME);
      })
      .catch(error => {
        this.setState(updateByPropertyName('error', error));
      });

    
  }

  render() {
    const {
      email,
      password,
      error,
    } = this.state;

    const isInvalid =
      password === '' ||
      email === '';

    return (
      <div>
        <div className="loginBackground">
          <h1 className="loginHeader">LOG IN</h1>
          <form onSubmit={this.onSubmit}>
            <div className="emailBar">
              <input
                spellCheck="false"
                className="textBox"
                value={email}
                onChange={event => this.setState(updateByPropertyName('email', event.target.value))}
                type="text"
                placeholder="Email Address"
              />
            </div>

            <div className="emailBar">
              <input
                className="textBoxPass"
                value={password}
                onChange={event => this.setState(updateByPropertyName('password', event.target.value))}
                type="password"
                placeholder="Password"
              />
            </div>
            <PasswordForgetLink />
            <div className="centerLogIn">
              <button 
                className="signInButton"
                disabled={isInvalid} type="submit">
                Log In
              </button>
            </div>
            { error && <p>{error.message}</p> }
          </form>
          <SignUpLink />
        </div>
      </div>
    );
  }
}

export default withRouter(SignInPage);

export {
  SignInForm,
};
