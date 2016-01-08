import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default class WeinerBlock extends Component {
  constructor(props) {
    super(props);

    this.checkWeiner = this.checkWeiner.bind(this);
  }

  checkWeiner() {
    this.props.onClick(this.props.weinerData);
  }

  render() {
    let isChecked = _.result(_.find(this.props.weinerData.weinerTo, {userId: this.props.currentUser}), 'userChecked');
    return (
      <div onClick={this.checkWeiner} className="weiner-block">
          <p>content: {this.props.weinerData.content}</p>
          <p>created: {this.props.weinerData.created}</p>
          <p>isChecked: {isChecked ? 'true' : 'false'}</p>
      </div>

    )
  }
}

WeinerBlock.displayName = 'WeinerBlock';
WeinerBlock.propTypes = {
  currentUser: PropTypes.number,
  onClick: PropTypes.function,
  weinerData: PropTypes.object
};


export default WeinerBlock;
