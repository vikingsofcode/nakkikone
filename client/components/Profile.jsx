import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import WeinerBlock from './weiners/WeinerBlock';
import io from 'socket.io-client';
let socket = io('http://localhost:6678');
import CurrentUser from './users/CurrentUser'
import * as UserActions from '../actions/users';
import './profile.styl';
import LazyLoad from 'react-lazyload';

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.checkWeiner = this.checkWeiner.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    if (!this.props.currentUser.userId) {
      this.props.userActions.currentUser();
    }
  }

  checkWeiner(weiner) {
    let setChecked = _.find(weiner.weinerTo, { 'userId': this.props.currentUser.userId });

    socket.emit('weiner:set:checked', {id: weiner._id, checkedWeiner: setChecked});
  }

  logout() {
    this.props.userActions.logoutUser();
  }

  render() {

    let myWeiners = _.filter(this.props.weiners, {'weinerFrom': { 'userId': this.props.currentUser.userId }});

    let gotWeiners = _.filter(this.props.weiners, (weiner) => {
      return _.any(weiner.weinerTo, { 'userId': this.props.currentUser.userId });
    });

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
            link: '#',
            onClick: this.logout
          }
        ]}
        weiners={this.props.weiners}/>
      <div className="weiners-stat-list">
          <div className="received-weiners">
            <h1>Received weiners</h1>
            <div className="received-weiners-stats">
              <span>Dayum, you've been weinered <span className="weiner-stats-count">{gotWeiners.length}</span> times, man!</span>
            </div>
            <div className="received-weiners-list">
              {_.map(gotWeiners, (weiner) => {
                return (<LazyLoad><WeinerBlock weinerData={weiner} onClick={this.checkWeiner} currentUser={this.props.currentUser.userId} enableChecking={true}/></LazyLoad>)
              })}
            </div>
          </div>

          <div className="sent-weiners">
            <h1>Sent weiners</h1>
            <div className="sent-weiners-stats">
              <span>Whoah, dude... You have weinered people <span className="weiner-stats-count">{myWeiners.length}</span> times, man!</span>
            </div>
            <div className="sent-weiners-list">
              {_.map(myWeiners, (weiner) => {
                return (<LazyLoad><WeinerBlock weinerData={weiner} onClick={this.checkWeiner} currentUser={this.props.currentUser.userId} enableChecking={false}/></LazyLoad>)
              })}
            </div>
          </div>
        </div>
      </div>

    )
  }
}

Profile.displayName = 'Profile';
Profile.propTypes = {
  currentUser: PropTypes.object,
  userActions: PropTypes.object,
  users: PropTypes.array,
  weiners: PropTypes.array
};

function mapStateToProps(state) {
  return {
    currentUser: state.user.currentUser,
    weiners: state.weiner.weiners,
    users: state.user.users
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
)(Profile);
