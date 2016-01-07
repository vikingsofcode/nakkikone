import React, { Component, PropTypes } from 'react';

export default class UserBlock extends Component {
  constructor(props) {
    super(props);

    this.selectUser = this.selectUser.bind(this);
  }

  selectUser() {
    this.props.onClick(this.props.userData);
  }

  render() {
    return (
      <div onClick={this.selectUser} className="user-block">
          <p>id: {this.props.userData.userId}</p>
          <p>username: {this.props.userData.username}</p>
      </div>

    )
  }
}

UserBlock.displayName = 'UserBlock';
UserBlock.propTypes = {
  onClick: PropTypes.function,
  userData: PropTypes.object
};


export default UserBlock;
