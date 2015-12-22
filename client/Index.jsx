import React from 'react'
import ReactDOM from 'react-dom'
import App from 'components/App'

import io from 'socket.io-client'

let socket = io('http://localhost:6678');

socket.on('event:connect', (data) => {
  console.log(data);
});

ReactDOM.render(<App />, document.getElementById('app'));
