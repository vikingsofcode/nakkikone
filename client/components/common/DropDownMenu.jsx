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
          return <Link to={item.link} key={index}>{item.text}</Link>
        })}
      </nav>

    )
  }
}

DropDownMenu.displayName = 'DropDownMenu';
DropDownMenu.propTypes = {
  navItems: PropTypes.array
};


export default DropDownMenu;
