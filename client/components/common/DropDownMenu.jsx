import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class DropDownMenu extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <nav className={`navbar-nav ${this.props.isNavOpen ? 'nav-open' : ''}`}>
        {this.props.navItems.map((item, index) => {
          return <a href={item.link} key={index} onClick={item.onClick}>{item.text}</a>
        })}
      </nav>

    )
  }
}

DropDownMenu.displayName = 'DropDownMenu';
DropDownMenu.propTypes = {
  isNavOpen: PropTypes.bool,
  navItems: PropTypes.array
};


export default DropDownMenu;
