import { handleActions } from 'redux-actions';

import SET_USERS from '../actions/users';
import CURRENT_USER from '../actions/users';

let initialState = {
  users: [],
  currentUser: {}
};

export default handleActions({
  SET_USERS: (state, action) => {
    return Object.assign({}, state, {
      users: action.payload
    });
  },
  CURRENT_USER: (state, action) => {
    return Object.assign({}, state, {
      currentUser: action.payload
    });
  }
}, initialState);
