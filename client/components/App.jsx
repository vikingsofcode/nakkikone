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
import LazyLoad from 'react-lazyload';

export default class App extends Component {
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
      username: user.username,
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
    let weinerList = this.props.weiners.length ? this.props.weiners.map((weiner) => {
    if (weiner.status !== 1) {
      return (<LazyLoad offset={10}><WeinerBlock key={weiner._id} weinerData={weiner} /></LazyLoad>);
    }
  }) : 'No weiners :(';

    return (
      <div className="weiner-app">
        <CurrentUser
          userData={this.props.currentUser}
          navItems={[
            {
              text: 'Home',
              link: '/weiner'
            },
            {
              text: 'Profile',
              link: '/weiner/profile'
            },
            {
              text: 'Logout',
              link: '/',
              onClick: this.logout
            }
          ]}
          weiners={this.props.weiners}
        />
          <div className="user-list">
            {this.props.users.map((user) => {
              return (<UserBlock key={user.userId} userData={user} onClick={this.selectUser}/>);
              })
            }
          </div>

          <div className="send-weiner">
            <input type="text"
              value={this.state.weinerContent}
              onChange={this.handleChange}
              className="weiner-input"
              placeholder="What kind of a weiner is this?"
              maxLength="50"/>
            <button onClick={this.addWeiner}
              className="btn btn-add-weiner"
              disabled={
                !this.state.weinerContent.length ||
                   !this.state.selectedUsers.length
                 }>
                 Weiner away!
               </button>

               <span className="char-count">{50 - this.state.weinerContent.length}</span>


               <div className="send-weiner-people">
                  <p>Weiner these people:</p>
                    {this.state.selectedUsers.map((user) => {
                        return (<div className="weiner-person">{user.username}</div>);
                      })}
                </div>
          </div>

          <div className="weiner-list">
            {weinerList}
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
