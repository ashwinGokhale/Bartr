import { db } from './firebase';

// User API

export const doCreateUser = (id, username, email) =>
  db.ref(`users/${id}`).set({
    username,
    email,
  });

export const getUsers = () =>
  db.ref('users').once('value');

// Other db APIs ...
