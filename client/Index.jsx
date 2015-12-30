import React from 'react';
import { render } from 'react-dom';
import App from 'components/App';
import { bindActionCreators } from 'redux';
import io from 'socket.io-client';
import * as WeinerActions from './actions/weiners';
import { Provider } from 'react-redux';
import configureStore from './store';

let socket = io('http://localhost:6678');

const store = configureStore();

socket.on('weiner:error', (data) => {
  console.log(data);
});

socket.emit('weiner:get');

socket.on('weiner:list', (data) => {
  let weinerActions = bindActionCreators(WeinerActions, store.dispatch);
  weinerActions.setWeiners(data);
});


  render(<Provider store={store}><App />
</Provider>, document.getElementById('app')
);
