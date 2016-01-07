import { handleActions } from 'redux-actions';

import SET_USERS from '../actions/users'; // eslint-disable-line

let initialState = [];

export default handleActions({
  SET_USERS: (state, action) => {
    return action.payload;
  }
}, initialState);
