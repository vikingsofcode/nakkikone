import { createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import reducer from '../reducers';

const createStoreWithMiddleware = applyMiddleware(
  thunk,
  promise
)(createStore);

export default function configureStore(initailState) {
  const store = createStoreWithMiddleware(reducer, initailState);
  return store;
}
