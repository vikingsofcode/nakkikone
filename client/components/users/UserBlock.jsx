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
        <div className="user-block-image" style={{
            backgroundImage: 'url(' + this.props.userData.avatar + ')'
          }}></div>
        <div className="user-block-content">{this.props.userData.username}</div>
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
