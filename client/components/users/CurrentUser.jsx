import React, { Component, PropTypes } from 'react';
import DropDownMenu from '../common/DropDownMenu';

export default class CurrentUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isNavOpen: false
    };

    this.openNav = this.openNav.bind(this);
  }

  openNav() {
    this.setState({ isNavOpen: !this.state.isNavOpen });
  }

  render() {

    // let newWeiners = _.filter(this.props.weiners, (weiner) => {
    //   return _.any(weiner.weinerTo, { 'userId': this.props.currentUser.userId, 'userChecked': false });
    // });
    return (
      <div className="current-user-block" onClick={this.openNav}>
        <div className="current-user-image">
        </div>
        <div className="current-user-name">
          {this.props.userData &&
            this.props.userData.username
          }
        </div>
        <DropDownMenu navItems={this.props.navItems} isNavOpen={this.state.isNavOpen}/>
      </div>

    )
  }
}

CurrentUser.displayName = 'CurrentUser';
CurrentUser.propTypes = {
  navItems: PropTypes.array,
  userData: PropTypes.object
};


export default CurrentUser;
