import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import withAuthorization from '../Session/withAuthorization';

import './account.css'

const AccountPage = ({ authUser }) =>
  <div>


    <div className='profileInfo'>
      <h1>Account: {authUser.email}</h1>
        <div className='aboutBackground'>
        </div>

        <div className='reviewBackground'>
        </div>

        <div className='postBackground'>
        </div>
      </div>
    </div>

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
});

export default compose(
  withAuthorization((authUser) => !!authUser),
  connect(mapStateToProps)
)(AccountPage);