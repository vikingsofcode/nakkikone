import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import io from 'socket.io-client';
let socket = io('http://localhost:6678');
import _ from 'lodash';
import UserBlock from './users/UserBlock';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedUsers: []
    }

    this.addWeiner = this.addWeiner.bind(this);
    this.selectUser = this.selectUser.bind(this);
  }

  addWeiner() {
    socket.emit('weiner:create', {
      weinerFrom: {
          userId: this.props.currentUser.userId,
          username: this.props.currentUser.username
      },
      weinerTo: this.state.selectedUsers,
      content: 'loltest',
      created: new Date(),
      status: 'IN PROGRESS'
    });

    this.setState({ selectedUsers: [] });
  }

  selectUser(user) {
    const doc = {
      userId: user.userId,
      avatar: user.avatar,
      userChecked: false
    }

    if (_.includes(_.pluck(this.state.selectedUsers, 'userId'), user.userId)) {
      this.setState({ selectedUsers: _.remove(this.state.selectedUsers, _.indexOf(doc)) })
    } else {
      this.setState({ selectedUsers: this.state.selectedUsers.concat(doc)});
    }

  }
  render() {
    // console.log(this.props.weiners);
    // console.log(this.props.users);
    let user = this.props.currentUser;
    let array = [];
    this.props.weiners.forEach((weiner) => {
      array.push(<p>weiner</p>);
    })

    let userlist = [];
    this.props.users.forEach((user) => {
      userlist.push(<UserBlock key={user.userId} userData={user} onClick={this.selectUser}/>);
    });
    return (
      <div>
          <p>Current user: {user.username}</p>
          <p><b>users</b></p>
          {userlist}
          <button onClick={this.addWeiner}>weiner plz</button>
          <p><b>weiners</b></p>
          {array}
        <p>
          <b>Selected people:</b>
          <span>{this.state.selectedUsers.map((user) => {
              return user.userId;
            })}</span>
      </p>
      </div>

    )
  }
}

App.displayName = 'App';
App.propTypes = {
  currentUser: PropTypes.object,
  users: PropTypes.array,
  weiners: PropTypes.array
};

function mapStateToProps(state) {
  return {
    weiners: state.weiner.weiners,
    users: state.user.users,
    currentUser: state.user.currentUser
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
