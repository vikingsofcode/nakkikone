import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import io from 'socket.io-client';
let socket = io('http://localhost:6678');
import _ from 'lodash';
import UserBlock from './users/UserBlock';
import WeinerBlock from './weiners/WeinerBlock';
import './main.styl';
import * as UserActions from '../actions/users';
import CurrentUser from './users/CurrentUser'

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedUsers: [],
      weinerContent: ''
    };

    this.addWeiner = this.addWeiner.bind(this);
    this.selectUser = this.selectUser.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.logout = this.logout.bind(this);
  }

  addWeiner() {
    socket.emit('weiner:create', {
      weinerFrom: {
          userId: this.props.currentUser.userId,
          username: this.props.currentUser.username
      },
      weinerTo: this.state.selectedUsers,
      content: this.state.weinerContent,
      created: new Date(),
      status: 0
    });

    this.setState({ selectedUsers: [], weinerContent: '' });
  }

  selectUser(user) {
    const doc = {
      userId: user.userId,
      avatar: user.avatar,
      userChecked: false
    }

    let users = this.state.selectedUsers;

    if (_.includes(_.pluck(this.state.selectedUsers, 'userId'), user.userId)) {
      this.setState({ selectedUsers: _.reject(this.state.selectedUsers, {userId: user.userId})})
    } else {
      this.setState({ selectedUsers: users.concat(doc)});
    }

  }

  handleChange(e) {
    this.setState({ weinerContent: e.target.value });
  }

  logout() {
    this.props.userActions.logoutUser();
  }
  render() {
    let newWeiners = _.filter(this.props.weiners, (weiner) => {
      return _.any(weiner.weinerTo, { 'userId': this.props.currentUser.userId, 'userChecked': false });
    });

    let user = this.props.currentUser;
    let array = [];
    this.props.weiners.forEach((weiner) => {
      if (weiner.status !== 1) {
        array.push(<WeinerBlock key={weiner._id} weinerData={weiner} />);
      }

    });

    let userlist = [];
    this.props.users.forEach((user) => {
      userlist.push(<UserBlock key={user.userId} userData={user} onClick={this.selectUser}/>);
    });

    return (
      <div className="weiner-app">
        <CurrentUser userData={this.props.currentUser}
        navItems={[
          {
            text: 'Profile',
            link: '/weiner/profile'
          },
          {
            text: 'Logout',
            link: '#'
          }
        ]} />
          <div className="user-list">
            {userlist}
          </div>

          <a href="#" onClick={this.logout}>logout lol</a>

          <div className="send-weiner">
            <input type="text" ref="weinerContent" value={this.state.weinerContent} onChange={this.handleChange} className="weiner-input"/>
            <button onClick={this.addWeiner} className="btn btn-add-weiner" disabled={
                !this.state.weinerContent.length ||
                   !this.state.selectedUsers.length
                 }>weiner plz</button>


                <p>
                  <b>Selected people:</b>
                  <span>{this.state.selectedUsers.map((user) => {
                      return user.userId;
                    })}</span>
                </p>
          </div>

          <div className="weiner-list">
            {array}
          </div>
      </div>

    )
  }
}

App.displayName = 'App';
App.propTypes = {
  currentUser: PropTypes.object,
  userActions: PropTypes.object,
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
    userActions: bindActionCreators(UserActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
