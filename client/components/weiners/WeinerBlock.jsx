import React, { Component, PropTypes } from 'react';

export default class WeinerBlock extends Component {
  constructor(props) {
    super(props);

    this.checkWeiner = this.checkWeiner.bind(this);
  }

  checkWeiner() {
    this.props.onClick(this.props.weinerData);
  }

  render() {
    return (
      <div onClick={this.checkWeiner} className="weiner-block">
          <p>content: {this.props.weinerData.content}</p>
          <p>created: {this.props.weinerData.created}</p>
          <p>weinerTo: {this.props.weinerData.weinerTo.map((weiner) => {
              return weiner.userChecked;
            })}</p>
      </div>

    )
  }
}

WeinerBlock.displayName = 'WeinerBlock';
WeinerBlock.propTypes = {
  onClick: PropTypes.function,
  weinerData: PropTypes.object
};


export default WeinerBlock;
