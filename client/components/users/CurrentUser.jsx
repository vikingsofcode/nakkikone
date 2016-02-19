import React, { Component, PropTypes } from 'react';
import DropDownMenu from '../common/DropDownMenu';
import './current-user.styl';
import _ from 'lodash';

export default class CurrentUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isNavOpen: false
    };

    this.openNav = this.openNav.bind(this);
    this.handleBodyClick = this.handleBodyClick.bind(this);
  }

  componentDidMount() {
    document.body.addEventListener('click', this.handleBodyClick);
  }
  componentWillUnmount() {
    document.body.removeEventListener('click', this.handleBodyClick);
  }

  openNav() {
    this.setState({ isNavOpen: !this.state.isNavOpen });
  }

  handleBodyClick() {
    this.setState({ isNavOpen: false });
  }

  render() {

    let newWeiners = _.filter(this.props.weiners, (weiner) => {
      return _.any(weiner.weinerTo, { 'userId': this.props.userData.userId, 'userChecked': false });
    }).length;

    return (
      <div className="current-user-block" onClick={this.openNav}>
        {newWeiners > 0 &&
          <div className="new-weiners"><span>{newWeiners}</span></div>
        }
        <div className="current-user-info">
          <div className="current-user-image" style={{
              backgroundImage: 'url(' + this.props.userData.avatar + ')'
            }}>
          </div>
          <div className="current-user-name">
            {this.props.userData &&
              this.props.userData.username
            }
          </div>
        </div>
        <DropDownMenu navItems={this.props.navItems} isNavOpen={this.state.isNavOpen}/>
      </div>

    )
  }
}

CurrentUser.displayName = 'CurrentUser';
CurrentUser.propTypes = {
  navItems: PropTypes.array,
  userData: PropTypes.object,
  weiners: PropTypes.array
};


export default CurrentUser;
