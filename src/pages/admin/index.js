import React, { Component } from "react";
import { Row, Col } from "antd";
import Header from './Header';
import Footer from './Footer';
import LeftBar from './LeftBar';
import './admin.less';
import { isUserLogin } from '../../middleware/localStorage/login';
import { baseRoute, routerConfig } from '../../config/router.config';
import { withRouter } from 'react-router-dom';
class Admin extends Component {
  componentDidMount(){
    document.title = '溯源管理后台系统'
  }

  render() {
    return (
      <Row className="container">
        <Col span={4} className="nav-left">
          <LeftBar />
        </Col>
        <Col span={20}  className="main">
          <Header myProps="ok" />
          <Row className="content">
            {this.props.children}
          </Row>
          <Footer />
        </Col>
      </Row>
    )
  }
}
export default withRouter(Admin)