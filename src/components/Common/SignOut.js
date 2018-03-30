import React from 'react';
import { auth } from '../../firebase';

export const signOut = (event) => auth.signOut();

const SignOutButton = () =>
  <button
    type="button"
    onClick={signOut}
    className="navButton"
  >
    Sign Out
  </button>

export default SignOutButton