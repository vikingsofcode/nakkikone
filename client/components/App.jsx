import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import io from 'socket.io-client';
let socket = io('http://localhost:6678');

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.addWeiner = this.addWeiner.bind(this);
  }

  addWeiner() {
    socket.emit('weiner:create', {
      weinerFrom: {
          userid: '2',
          username: 'nakkipate'
      },
      weinerTo: [{
        userid: '3',
        avatar: 'lolnotfound',
        userChecked: false
      }],
      content: 'loltest',
      created: new Date(),
      status: 'IN PROGRESS'
    });
  }
  render() {
    // console.log(this.props.weiners);
    // console.log(this.props.users);
    let array = [];
    this.props.weiners.forEach((weiner) => {
      array.push(<p>weiner</p>);
    })
    return (
      <div>
          <button onClick={this.addWeiner}>weiner plz</button>
          {array}
        <p>
          Lo there, do I see my father, <br />
          Lo there, do I see my mother, my sisters and brothers, <br />
          Lo there, do I see the line of my people, back to the beginning, <br />
          Lo, they do call to me, they bid me take my place among them, <br />
          In the halls of Valhalla where the brave may code forever.
      </p>
      </div>

    )
  }
}

App.displayName = 'App';
App.propTypes = {
  users: PropTypes.array,
  weiners: PropTypes.array
};

function mapStateToProps(state) {
  return {
    weiners: state.weiner.weiners,
    users: state.user.users
  };
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
