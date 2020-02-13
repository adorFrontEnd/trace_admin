import React, { Component } from "react";
import { message } from 'antd';
import LoginForm from './LoginForm';
import { userLogin } from '../../api/oper/login';
import { setCacheUserInfo } from '../../middleware/localStorage/login';
import { baseRoute, routerConfig } from '../../config/router.config';
import './index.less';

export default class Login extends Component {

  state = {
    showBtnLoading: false,
    isShow: false
  }

  componentDidMount() {
    document.title = '溯源管理后台系统'
  }

  login = (data) => {
    let params = {
      username: data.username,
      password: data.password,
      verifyCode: data.imageCode,
      now: Date.now()
    }
    if (this.state.showBtnLoading) {
      return
    }

    this.setState({
      showBtnLoading: true
    })

    userLogin(params).then((res) => {

      if (res && res.token) {
        message.success("登录成功！");
        setCacheUserInfo(res);
        setTimeout(() => {
          this.props.history.push(routerConfig['customer.customerManage'].path);
          this.setState({
            showBtnLoading: false
          })
        }, 1000)
        return;
      }
      this.setState({
        showBtnLoading: false
      })
      message.error("登录失败！")
    })
      .catch(() => {
        this.setState({
          showBtnLoading: false
        })
      })
  }
  render() {
    return (

      // <div style={{padding:'0 22% 0 22%'}}>
      //   <div style={{ padding: '15px', borderBottom: '1px solid #BCBCBC' }}>
      //     <div style={{ display: "flex", position: 'relative'}}>
      //       <div><img src='/favicon.ico' style={{ height: 50, width: 50, marginRight: 10 }} /></div>
      //       <div className='login-form-title'>爱朵智能</div>
      //       <div style={{ position: 'absolute', bottom: '0px', left: '167px', fontSize: '16px' }}>溯源系统平台后台登录</div>
      //     </div>
      //   </div>
      //   <div style={{display:'flex' ,padding:'20px'}}>
      //   <LoginForm loading={this.state.showBtnLoading} login={this.login} isShow={this.state.isShow}/>
      //   <div className='bgimg'></div>
      //   </div>
      // </div>
      <div style={{ width: "80%", margin: "0 auto", maxWidth: "900px", minWidth: "700px" }}>
        <div style={{ padding: '15px', borderBottom: '1px solid #BCBCBC' }}>
          <div style={{ display: "flex", position: 'relative' }}>
            <div><img src='/favicon.ico' style={{ height: 50, width: 50, marginRight: 10 }} /></div>
            <div className='login-form-title'>爱朵智能</div>
            <div style={{ position: 'absolute', bottom: '0px', left: '167px', fontSize: '16px' }}>
              溯源系统平台后台登录     
              <span style={{ fontSize: '18px', marginLeft: "10px" }}>登录</span></div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: "space-between", padding: '20px 4px' }}>
          <div style={{ width: 366, flex: "0 0 auto", display: "flex", alignItems: "center" }} >
            <LoginForm loading={this.state.showBtnLoading} login={this.login} isShow={this.state.isShow} />
          </div>
          <div style={{ width: "45%", flex: "1 1 auto", display: "flex", alignItems: "center", marginLeft: "12px" }}>
            <img src='/image/bg.jpg' style={{ maxWidth: "100%" }} />
          </div>
        </div>
      </div>
    )
  }
}



