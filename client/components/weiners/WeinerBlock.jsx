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
      <div className="weiner-wrap">
        <div className={`weiner-block ${isChecked ? 'checked' : 'not-checked'}`}>
            {this.props.weinerData.weinerFrom.username} weinered: <span className="weiner-block-title">{this.props.weinerData.content}</span>
            <div className="weiner-block-users">
              {this.props.weinerData.weinerTo.map((weiner) => {
                return (
                  <div className="weiner-block-user" style={{
                      backgroundImage: 'url(' + weiner.avatar + ')'
                    }}></div>
                )
              })}
            </div>
            {isChecked &&
              <div className="weiner-is-checked">Checked</div>
            }
        </div>
        <div className="weiner-controls">
          {this.props.enableChecking && !isChecked &&
            <div
              className="weiner-check"
              onClick={this.props.enableChecking ? this.checkWeiner : null}>Check</div>
          }
        </div>
      </div>

    )
  }
}

WeinerBlock.displayName = 'WeinerBlock';
WeinerBlock.propTypes = {
  currentUser: PropTypes.number,
  enableChecking: PropTypes.bool,
  onClick: PropTypes.function,
  weinerData: PropTypes.object
};


export default WeinerBlock;
