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
      <div onClick={this.checkWeiner} className={`weiner-block ${isChecked ? 'checked' : 'not-checked'}`}>
          <span className="weiner-block-title">{this.props.weinerData.content}</span>
          <div className="weiner-block-users">
            {this.props.weinerData.weinerTo.map((weiner) => {
              return (
                <div className="weiner-block-user" style={{
                    backgroundImage: 'url(' + weiner.avatar + ')'
                  }}></div>
              )
            })}
          </div>
          <div className="weiner-block-status">
            {this.props.weinerData.status === 0 ? 'IN PROGRESS' : 'DONE'}
          </div>
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
