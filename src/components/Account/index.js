import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import withAuthorization from '../Session/withAuthorization';
import './index.css'

const AccountPage = ({ authUser }) =>
  <div className="displayFormat">
    <h1>Email: {authUser.email}</h1>
    <h1>Display Name: {console.log(authUser)}</h1>
    <PasswordForgetForm />
    <PasswordChangeForm />
  </div>

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
});

export default compose(
  withAuthorization((authUser) => !!authUser),
  connect(mapStateToProps)
)(AccountPage);