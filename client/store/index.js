import { createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import reducer from '../reducers';

const createStoreWithMiddleware = applyMiddleware(
  thunk
)(createStore);

export default function configureStore(initailState) {
  const store = createStoreWithMiddleware(reducer, initailState);
  return store;
}
