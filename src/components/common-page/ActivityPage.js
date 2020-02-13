import React, { Component } from 'react';
import './activity-page.less';

export default class CommonPage extends Component {

  componentDidMount() {
    document.title = this.props.title
    document.description = this.props.description
  }
  render() {
    return (
      <div className="activity-page-body">
        {this.props.children}
      </div>
    )
  }
}