import { combineReducers } from 'redux';
import weiner from './weiners';
import user from './users';

const rootReducer = combineReducers({
  weiner,
  user
});

export default rootReducer;
