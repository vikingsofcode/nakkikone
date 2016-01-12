import { createAction } from 'redux-actions';
import axios from 'axios';

export const SET_USERS = 'SET_USERS';
export const setUsers = createAction(SET_USERS);

export const CURRENT_USER = 'CURRENT_USER';
export const currentUser = createAction(CURRENT_USER, () => {
  return axios.get('http://localhost:6678/current-user').then((res) => {
    return res.data;
  });
});

export const LOGOUT_USER = 'LOGOUT_USER';
export const logoutUser = () => {
  return axios.post('http://localhost:6678/logout');
};
