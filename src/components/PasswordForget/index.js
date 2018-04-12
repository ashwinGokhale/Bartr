import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { auth } from '../../firebase';
import * as routes from '../../constants';
import './index.css';

const PasswordForgetPage = () =>
  <div className="passResetPageBackground">
    <PasswordForgetForm />
  </div>

const updateByPropertyName = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  email: '',
  error: null,
};

class PasswordForgetForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { email } = this.state;

    auth.sendPasswordResetEmail(email)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
      })
      .catch(error => {
        this.setState(updateByPropertyName('error', error));
      });

    event.preventDefault();
  }

  render() {
    const {
      email,
      error,
    } = this.state;

    const isInvalid = email === '';

    return (
      <div className="passResetBackground">
        <form onSubmit={this.onSubmit}>
          <div className="resetPassInfo">
            <input
              className="changeEmailInput"
              value={this.state.email}
              onChange={event => this.setState(updateByPropertyName('email', event.target.value))}
              type="text"
              placeholder="Email Address"
            />
            <div className="centerPassReset">
              <button className="passButton" disabled={isInvalid} type="submit">
                Reset My Password
              </button>
            </div>
          </div>
          { error && <p>{error.message}</p> }
        </form>
      </div>
    );
  }
}

const PasswordForgetLink = () =>
  <p>
    <Link className="format" to={routes.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>

export default PasswordForgetPage;

export {
  PasswordForgetForm,
  PasswordForgetLink,
};
