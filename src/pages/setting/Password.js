import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Select, Tabs, Col, Row, Icon, Radio, Button, Divider, Popconfirm, Modal, Checkbox, InputNumber } from "antd";
import { pagination } from '../../utils/pagination';
import Toast from '../../utils/toast';
import { SearchForm, SubmitForm } from '../../components/common-form';
import { getCacheUserInfo } from '../../middleware/localStorage/login';
import { updatePassword } from '../../api/user/user'
import dateUtil from '../../utils/dateUtil';
const { TabPane } = Tabs;
const _title = "修改密码";
const _description = "";

class Page extends Component {

  state = {

  }

  componentDidMount() {

  }

  //保存页面
  saveClick = () => {
    this.props.form.validateFields((err, params) => {
      if (err) {
        return;
      }
      let { oldPassword, newPassword, repeatPassword } = params;
      if (newPassword != repeatPassword) {
        Toast('新密码与再次输入密码不一致！');
        return;
      }
      updatePassword({ oldPassword, newPassword })
        .then(() => {
          Toast("修改密码成功!", "success");
         this.handleReset()
        })
    })
  }
  // 清空表单数据
  handleReset=()=>{
    this.props.form.resetFields();
  }




  /**渲染**********************************************************************************************************************************/

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <CommonPage title={_title} description={_description} >

        <div style={{ width: 400, paddingLeft: "20px" }}>
          <Form >
            <Form.Item label="原密码:" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
              {getFieldDecorator("oldPassword",
                {
                  initialValue: null,
                  rules: [
                    { min: 6, message: '请至少输入6位密码!' },
                    { required: true, message: '请输入原密码!' }
                  ],
                })(
                  <Input
                    maxLength={10}
                    style={{ width: 280 }}
                    placeholder="输入原密码" />
                  
                )}
            </Form.Item>
            <Form.Item label="新密码:" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
              {getFieldDecorator('newPassword',
                {
                  initialValue: null,
                  rules: [
                    { min: 6, message: '请至少输入6位密码!' },
                    { required: true, message: '请输入新密码!' }
                  ],
                })(
                  <Input
                    maxLength={10}
                    style={{ width: 280 }}
                    placeholder="输入新密码" />
                )}
            </Form.Item>
            <Form.Item label="确认新密码:" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
              {getFieldDecorator('repeatPassword',
                {
                  initialValue: null,
                  rules: [
                    { min: 6, message: '请至少输入6位密码!' },
                    { required: true, message: '请输再次输入新密码!' }
                  ],
                })(
                  <Input
                    maxLength={10}
                    style={{ width: 280 }}
                    placeholder="再次输入新密码" />
                )}
            </Form.Item>
            <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 20 }}>
              <Button type="primary" onClick={this.saveClick} style={{ marginLeft: "30%", 'display': 'block' }}>修改</Button>
            </Form.Item>
          </Form>
        </div>
   

      </CommonPage >
    )
  }
}

export default Form.create()(Page);