import { handleActions } from 'redux-actions';

import SET_WEINERS from '../actions/weiners'; // eslint-disable-line

let initialState = [];

export default handleActions({
  SET_WEINERS: (state, action) => {
    return Object.assign([], state, action.payload);
  }
}, initialState);
