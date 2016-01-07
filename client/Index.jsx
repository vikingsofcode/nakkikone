import React from 'react';
import { render } from 'react-dom';
import { Router, IndexRoute, Route } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import App from 'components/App';
import Login from 'components/Login';
import { bindActionCreators } from 'redux';
import io from 'socket.io-client';
import * as WeinerActions from './actions/weiners';
import * as UserActions from './actions/users';
import { Provider } from 'react-redux';
import configureStore from './store';

let socket = io('http://localhost:6678');

const store = configureStore();
const history = createBrowserHistory();

socket.on('weiner:error', (data) => {
  console.log(data);
});

socket.on('user:error', (data) => {
  console.log(data);
});

socket.emit('weiner:get');
socket.emit('user:get');

socket.on('weiner:list', (data) => {
  let weinerActions = bindActionCreators(WeinerActions, store.dispatch);
  weinerActions.setWeiners(data);
});

socket.on('user:list', (data) => {
  let userActions = bindActionCreators(UserActions, store.dispatch);
  userActions.setUsers(data);
});

render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/">
      <IndexRoute component={Login} />
      <Route path="weiner" component={App} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
