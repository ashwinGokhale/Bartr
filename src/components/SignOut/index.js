import React from 'react';

import { auth } from '../../firebase';

const signOut = (event) => auth.signOut();

const SignOutButton = () =>
  <button
    type="button"
    onClick={signOut}
  >
    Sign Out
  </button>

export default SignOutButton;
