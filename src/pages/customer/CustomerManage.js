import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Select, Col, Row, Icon, Button, Divider, Popconfirm, Modal, Checkbox, InputNumber, DatePicker, Radio } from "antd";
import { pagination } from '../../utils/pagination';
import Toast from '../../utils/toast';
import { deleteCustomer, searchUserList, saveOrUpdate, statusUpdateUser } from '../../api/customer/customer';
import { SearchForm, SubmitForm } from '../../components/common-form';
import dateUtil from '../../utils/dateUtil';
import { getAllList, getAll } from '../../api/scource/source';
import AuthSelection from './AuthSelection';

import moment from 'moment';

const FormItem = Form.Item;
const _title = "客户账号";
const _description = "";

class Page extends Component {

  state = {
    customerList: null,
    showTableLoading: false,
    newItemModalVisible: false,
    editItemModalVisible: false,
    selectCustomer: null,
    sourceList: [],
    adminModels: null,
    endOpen: false,
    authorizationDatePermanent: 0,
    subAccountsUnlimited: 0,
    payModalVisible: false,
    status: null,
    id: '',
    subAccountsUnlimitedChecked: false,
    isShow: false,
    subAccountsQuantity: '1',
    authorizationDatePermanentChecked: false,
    isnn: false
  }

  componentDidMount() {
    this.getPageData();
    this.getSourceList();
  }

  params = {
    page: 1
  }


  // 获取页面列表
  getPageData = () => {
    let _this = this;
    this._showTableLoading();
    searchUserList(this.params).then(res => {
      this._hideTableLoading();
      let _pagination = pagination(res, (current) => {
        this.params.page = current
        _this.getPageData();
      }, (cur, pageSize) => {
        this.params.page = 1;
        this.params.size = pageSize;
        _this.getPageData();
      })

      this.setState({
        customerList: res.data,
        pagination: _pagination,

      })

    }).catch(() => {
      this._hideTableLoading();
    })
  }

  getSourceList = () => {
    getAll()
      .then(sourceList => {
        this.setState({
          sourceList
        })
      })
  }

  _showTableLoading = () => {
    this.setState({
      showTableLoading: true
    })
  }

  _hideTableLoading = () => {
    this.setState({
      showTableLoading: false
    })
  }

  deleteTableItem = (item) => {
    let { id } = item;
    deleteCustomer({ id })
      .then(() => {
        Toast("删除成功！", "success");
        this.getPageData();
      })
  }
  // 编辑
  editTableItem = (record) => {

    let { adminModels, authorizationDatePermanent, subAccountsUnlimited, subAccountsQuantity } = record;
    adminModels = adminModels.split(',').filter(item => item);
    subAccountsQuantity = subAccountsUnlimited == 0 ? subAccountsQuantity : "";
    let subAccountsUnlimitedChecked = subAccountsUnlimited != 0;

    this.setState({
      record,
      adminModels,
      // isShow: true,
      subAccountsQuantity,
      subAccountsUnlimitedChecked,
      authorizationDatePermanent
    })

    if (authorizationDatePermanent == 1) {

      this.props.form.setFieldsValue({
        startAuthorizationDateStamp: moment(dateUtil.getDateTime(record.startAuthorizationDate), 'YYYY-MM-DD')
      });
    } else {

      this.props.form.setFieldsValue({
        startAuthorizationDateStamp: moment(dateUtil.getDateTime(record.startAuthorizationDate), 'YYYY-MM-DD'),
        endAuthorizationDateStamp: moment(dateUtil.getDateTime(record.endAuthorizationDate), 'YYYY-MM-DD')
      });
    }


    this.showAddModal(record);
    // this.resetClicked();
  }
  // 充值
  payTableItem = (selectCustomer) => {
    this.setState({
      selectCustomer
    })
    this._showpayModal(selectCustomer);
  }

  // 禁用角色
  deactiveStatus = (record) => {
    let { id } = record;
    let status = '0';
    statusUpdateUser({ id, status })
      .then(() => {
        Toast("禁用成功！", "success");
        this.getPageData();
      })
  }

  // 激活角色
  activeStatus = (record) => {
    let { id } = record;
    let status = '1';
    statusUpdateUser({ id, status })
      .then(() => {
        Toast("激活成功！", "success");
        this.getPageData();
      })
  }
  // 对授权期限处理

  authorizationDate = (text, recorder) => {
    return (
      <span>
        <span>{dateUtil.getDate(recorder.startAuthorizationDate)}</span>
        <span>~</span>
        {recorder.authorizationDatePermanent == 1 ? <span>永久</span> : <span>{dateUtil.getDate(recorder.endAuthorizationDate)}</span>}
      </span>)
  }

  subAccountsQuantity = (text, recorder) => {
    return (

      <div>{recorder.subAccountsUnlimited == 1 ? "不限" : recorder.subAccountsQuantity}</div>
    )
  }

  totalExportQuantity = (text, recorder) => {
    return (
      <div>
        {recorder.exportQuantityUnlimited == 1 ? <div>不限</div> : <div>{recorder.totalExportQuantity}</div>}
      </div>
    )
  }

  surplusExportQuantity = (text, recorder) => {
    return (
      <div>
        {recorder.exportQuantityUnlimited == 1 ? <div>不限</div> : <div>{recorder.surplusExportQuantity}</div>}
      </div>
    )
  }

  domainName = (text, recorder) => {
    return (
      <a onClick={this.clickgologin(text, recorder)}>
        {recorder.domainName}
      </a>
    )
  }

  // 表格相关列

  columns = [

    { title: "公司编号", dataIndex: "companyNum", width: 100 },
    { title: "公司", dataIndex: "companyName" },
    { title: "登录地址", render: (text, recorder) => <a size="small" href={`http://user.trace.adorsmart.com/login/${recorder.domainName}`} target="_blank" rel="noopener noreferrer">{`http://user.trace.adorsmart.com/login/${recorder.domainName}`}</a> },
    { title: "子账号数", render: (text, recorder) => this.subAccountsQuantity(text, recorder) },
    { title: "唯一码剩余", render: (text, recorder) => this.surplusExportQuantity(text, recorder) },
    { title: "唯一码总数", render: (text, recorder) => this.totalExportQuantity(text, recorder) },
    { title: "状态", dataIndex: "status", render: data => data == "1" ? "激活" : "禁用" },
    { title: '授权期限', render: (text, recorder) => this.authorizationDate(text, recorder) },
    { title: "最后操作日期", dataIndex: "updateTime", render: data => data ? dateUtil.getDateTime(data) : "--" },
    {
      title: '操作',
      render: (text, record, index) => (
        <span>
          <a size="small" onClick={() => { this.payTableItem(record) }} disabled={record.exportQuantityUnlimited == 1}>充值</a>
          <Divider type="vertical" />
          <a size="small" onClick={() => { this.editTableItem(record) }} >编辑</a>
          <Divider type="vertical" />
          {
            record.status == '1' ?
              <Popconfirm
                placement="topLeft" title='确认要禁用吗？'
                onConfirm={() => { this.deactiveStatus(record) }} >
                <a size="small" >禁用</a>
              </Popconfirm>
              :
              <Popconfirm
                placement="topLeft" title='确认要激活吗？'
                onConfirm={() => { this.activeStatus(record) }} >
                <a size="small">激活</a>
              </Popconfirm>
          }
          <Divider type="vertical" />
          <Popconfirm
            placement="topLeft" title='确认要删除吗？'
            onConfirm={() => { this.deleteTableItem(record) }} >
            <a size="small" className="color-red">删除</a>
          </Popconfirm>

        </span>
      )
    }
  ]

  /****新加表单*************************************************************************************************************************** */
  _hideNewItemModal = () => {

    this.setState({
      newItemModalVisible: false,
      isShow: false,
      subAccountsUnlimitedChecked: false
    })
    this.resetClicked();
  }

  showAddModal = (data) => {
    let selectCustomer = data || null;
    this.newItemFormList[6].rules = data ? null : [{ required: true, message: '请输入密码!' }];
    let editFormValue = {};
    if (data) {
      this.newItemFormList[4] = '';
      this.newItemFormList[5] = '';
      let { companyName, phone, nickname, address } = data;
      editFormValue = { companyName, phone, nickname, address };

    } else {
      this.newItemFormList[4] = {
        type: "INPUT",
        field: "domainName",
        label: "域名称:",
        placeholder: "请输入域名称",
        rules: [
          { required: true, message: '请输入域名称!' },
          { pattern: /^[0-9a-zA-Z]{4,16}$/, message: '请输入数字或者字母,最小4位，最大16位!' }
        ]
      };
      this.newItemFormList[5] = {
        type: "INPUT",
        field: "admin",
        label: "超级管理员账号:",
        disabled: true,
        initialValue: "admin"
      }
      editFormValue = { ...editFormValue }
      this.setState({
        adminModels: null,
        subAccountsQuantity: null,
        subAccountsUnlimitedChecked: false,
        authorizationDatePermanent: "0"
      })
    }
    editFormValue._s = Date.now();
    this.setState({
      newItemModalVisible: true,
      editFormValue,
      selectCustomer
    })

  }

  // 新加表单
  newItemFormList = [
    {
      type: "INPUT",
      field: "companyName",
      label: "公司名:",
      placeholder: "请输入公司名",
      rules: [
        { required: true, message: '请输入公司名!' }
      ]
    },
    {
      type: "INPUT",
      field: "nickname",
      label: "公司联系人:",
      placeholder: "请输入公司联系人",
      rules: [
        { required: true, message: '请输入公司联系人!' }
      ]
    },
    {
      type: "INPUT",
      field: "phone",
      label: "联系人电话:",
      placeholder: "请输入联系人电话",
      rules: [
        { required: true, message: '请输入联系人电话!' },
        { pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/, message: '请输入正确的联系人电话!' }
      ]
    },
    {
      type: "INPUT",
      field: "address",
      label: "地址:",
      placeholder: "请输入地址",
      rules: [
        { required: true, message: '请输入地址!' }
      ]
    },

    {
      type: "INPUT",
      field: "domainName",
      label: "域名称:",
      placeholder: "请输入域名称",
      rules: [
        { required: true, message: '请输入域名称!' },
        { pattern: /^[0-9a-zA-Z]{4,16}$/, message: '请输入数字或者字母,最小4位，最大16位!' }
      ]
    },
    {
      type: "INPUT",
      field: "admin",
      label: "超级管理员账号:",
      disabled: true,
      initialValue: "admin"
    },
    {
      type: "INPUT",
      field: "adminPassword",
      label: "密码:",
      placeholder: "请输入密码",
      rules: [
        { required: true, message: '请输入密码!' },
        { min: 6, message: '请输入至少6位数的密码!' },
        { max: 12, message: '请输入最大12位数的密码!' }
      ]
    }

  ]

  newItemModalSaveClicked = (data) => {
    let { startAuthorizationDateStamp, endAuthorizationDateStamp } = this.state;
    this.props.form.validateFields((err, params) => {

      if (err) {
        return;
      }
      if (params && params.startAuthorizationDateStamp) {
        startAuthorizationDateStamp = moment(params.startAuthorizationDateStamp).format('YYYY-MM-DD') + ' ' + '00:00:00';
        startAuthorizationDateStamp = moment(startAuthorizationDateStamp).valueOf();
      }
      if (params && params.endAuthorizationDateStamp) {
        endAuthorizationDateStamp = moment(params.endAuthorizationDateStamp).format('YYYY-MM-DD') + ' ' + '23:59:59';
        endAuthorizationDateStamp = moment(endAuthorizationDateStamp).valueOf();
      } else {

      }
      endAuthorizationDateStamp = moment(endAuthorizationDateStamp).format('YYYY-MM-DD') + ' ' + '23:59:59';
      endAuthorizationDateStamp = moment(endAuthorizationDateStamp).valueOf();
    })
    let title = '添加成功！';
    let { adminPassword } = data
    adminPassword = adminPassword || null;
    let adminModels = this.state.adminModels;
    let { subAccountsQuantity, subAccountsUnlimited, authorizationDatePermanent } = this.state
    adminModels = adminModels ? adminModels.join() : "";
    adminModels = adminModels || null;
    let params = { ...data, adminPassword, subAccountsQuantity, subAccountsUnlimited, startAuthorizationDateStamp, endAuthorizationDateStamp, authorizationDatePermanent, adminModels }
    if (this.state.selectCustomer) {
      let { id } = this.state.selectCustomer;
      params.id = id;
      title = '修改成功！'
    }
    if (!startAuthorizationDateStamp) {
      Toast('请选择授权时间!')
      return;
    }
    saveOrUpdate(params)
      .then(() => {
        Toast(title, "success");
        this._hideNewItemModal();
        this.getPageData();
      })
  }


  /***************************状态*************** */
  statusFormList = [
    {
      type: "INPUT",
      field: "status",
      label: "状态:",
      placeholder: "请输入状态",
      rules: [
        { required: true, message: '请输入状态!' }
      ]
    }
  ]

  _showpayModal = (selectCustomer) => {
    this.setState({
      payModalVisible: true,
      id: selectCustomer.id
    })
  }

  _hidepayModal = () => {
    this.setState({
      payModalVisible: false

    })
  }


  onSubAccountNoLimitChecked = (e) => {
    this.setState({
      subAccountsUnlimitedChecked: e.target.checked
    })
    if (!this.state.subAccountsUnlimitedChecked) {
      let subAccountsUnlimited = 1;
      this.setState({
        subAccountsUnlimited
      })
    } else {
      let subAccountsUnlimited = 0;
      this.setState({
        subAccountsUnlimited
      })
    }
  }

  onSubAccountNumChange = (subAccountsQuantity) => {
    this.setState({
      subAccountsQuantity
    })
  }
  onNumChange = (e) => {
    let totalExportQuantity = e.currentTarget.value;

    this.setState({
      totalExportQuantity
    })
      ;
  }
  // 点击充值
  clickPay = () => {
    let { id, totalExportQuantity } = this.state;
    totalExportQuantity = totalExportQuantity || null
    let exportQuantityUnlimited = this.state.exportQuantityUnlimited;
    statusUpdateUser({ id, totalExportQuantity, exportQuantityUnlimited }).then(res => {
      Toast("充值成功!", "success");
      this._hidepayModal();
      this.getPageData();
    })
  }
  onExportQuantityUnlimited = (e) => {
    this.setState({
      radioValue: e.target.value
    })
    if (e.target.value == 2) {
      let exportQuantityUnlimited = 1;
      this.setState({
        exportQuantityUnlimited
      })
    }
  }
  onAuthorizationDatePermanentChecked = (e) => {

    let isChecked = e.target.checked;
    this.setState({
      authorizationDatePermanent: e.target.checked ? "1" : "0"
    })
  }


  disabledStartDate = (startAuthorizationDateStamp) => {
    const endAuthorizationDateStamp = this.state.endAuthorizationDateStamp;
    if (!startAuthorizationDateStamp || !endAuthorizationDateStamp) {
      return false;
    }
  }

  disabledEndDate = (endAuthorizationDateStamp) => {
    const startAuthorizationDateStamp = this.state.startAuthorizationDateStamp;
    if (!endAuthorizationDateStamp || !startAuthorizationDateStamp) {
      return false;
    }
    return endAuthorizationDateStamp.valueOf() <= startAuthorizationDateStamp.valueOf();
  }
  onStartChange = (value) => {
    this.onChange('startAuthorizationDateStamp', value);
  }

  onEndChange = (value) => {
    this.onChange('endAuthorizationDateStamp', value);
  }
  onChange = (field, value) => {
    this.setState({
      [field]: value
    });

  }
  inputDataChange = (e) => {
    let inputData = e.currentTarget.value;
    this.params = {
      ...this.params,
      inputData
    }

  }
  // 重置
  resetClicked = () => {
    this.props.form.resetFields();
  }

  onCheckedChange = (adminModels) => {
    // adminModels = adminModels.filter(item => item.indexOf('.') !== -1 || item == 'dataStatistics')
    this.setState({
      adminModels
    })
  }

  /******************************************************渲染******************************************************************************/

  render() {
    const { getFieldDecorator } = this.props.form;

    const { startAuthorizationDateStamp, endAuthorizationDateStamp, endOpen, authorizationDatePermanent, subAccountsUnlimited, inputDataCheck } = this.state;

    return (
      <CommonPage title={_title} description={_description} >
        <div className='padding20 flex-between'>
          <Button type='primary' onClick={() => { this.showAddModal() }}>添加客户</Button>
          <Form layout='inline'>
            <Form.Item>
              <Input placeholder='请输入关键字' onChange={this.inputDataChange} />
            </Form.Item>
            <Form.Item>
              <Button type='primary' onClick={this.getPageData}>查询</Button>
            </Form.Item>
          </Form>
        </div>
        <Table
          indentSize={20}
          expandedRowRender={
            record =>
              <p style={{ margin: 0 }}>
                <span>公司联系人：</span><span className='color-red margin-right'>{record.nickname || '--'}</span>
                <span>联系人电话：</span><span className='color-red margin-right'>{record.phone || '--'}</span>
                <span><span>地址：</span><span className='color-red margin-right'>{record.address || '--'}</span></span>
              </p>
          }
          rowKey="id"
          columns={this.columns}
          loading={this.state.showTableLoading}
          pagination={this.state.pagination}
          dataSource={this.state.customerList}
        />

        <Modal
          width={900}
          title="添加/编辑客户"
          visible={this.state.newItemModalVisible}
          footer={null}
          onCancel={this._hideNewItemModal}
          className='noPadding'
        >
          <div className='flex-center'>
            <SubmitForm
              clearWhenHide={true}
              showForm={this.state.newItemModalVisible}
              formItemList={this.newItemFormList}
              saveClicked={this.newItemModalSaveClicked}
              cancelClicked={this._hideNewItemModal}
              setFormValue={this.state.editFormValue}
            >

              <Row className='line-height40 margin-top'>
                <Col span={8} className='text-right'>
                  <span className='label-color label-required'>子账号数：</span>
                </Col>
                <Col span={16}>
                  <InputNumber
                    disabled={this.state.subAccountsUnlimitedChecked}
                    value={this.state.subAccountsQuantity}
                    min={1}
                    max={9999}
                    onChange={this.onSubAccountNumChange}
                    precision={0}
                  />
                  <span style={{ marginLeft: "20px" }}>
                    <Checkbox
                      checked={this.state.subAccountsUnlimitedChecked}
                      value={subAccountsUnlimited}
                      onChange={this.onSubAccountNoLimitChecked}
                    >
                      不限
                  </Checkbox>
                  </span>
                </Col>
              </Row>
              <Row className='line-height40 margin-top'>
                <Col span={8} className='text-right'>
                  <span className='label-color label-required'>授权日期：</span>
                </Col>
                <Form layout='inline'>
                  <Form.Item key={"startAuthorizationDateStamp"}>
                    {
                      getFieldDecorator('startAuthorizationDateStamp', {
                        initialValue: startAuthorizationDateStamp ? moment(startAuthorizationDateStamp, 'YYYY/MM/DD') : null

                      })(
                        <DatePicker style={{ width: 170 }}
                          disabledDate={this.disabledStartDate}
                          placeholder="请选择开始时间"
                          onChange={this.onStartChange}

                        />
                      )
                    }
                  </Form.Item>

                  <Form.Item label="-" colon={false} key={"endAuthorizationDateStamp"}>
                    {
                      getFieldDecorator('endAuthorizationDateStamp', {
                        initialValue: endAuthorizationDateStamp ? moment(endAuthorizationDateStamp, 'YYYY/MM/DD') : null,
                      })(
                        <DatePicker style={{ width: 170 }}
                          disabledDate={this.disabledEndDate}
                          disabled={this.state.authorizationDatePermanent == '1'}
                          placeholder={this.state.authorizationDatePermanent == '1' ? "--" : "请选择结束时间"}
                          onChange={this.onEndChange}
                        />
                      )
                    }
                  </Form.Item>
                  <Form.Item >
                    <Checkbox
                      checked={this.state.authorizationDatePermanent == '1'}
                      onChange={this.onAuthorizationDatePermanentChecked}
                    >
                      永久
                    </Checkbox>
                  </Form.Item>
                </Form>
              </Row>
              {
                this.state.isShow ?
                  null
                  :
                  <Row className='line-height40 margin-top'>
                    <Col span={8} className='text-right'>
                      <span className='label-color label-required'>超级管理员权限：</span>
                    </Col>
                    <Col span={16}>
                      <AuthSelection selectRoleAuth={this.state.adminModels} onCheckedChange={this.onCheckedChange}></AuthSelection>
                    </Col>
                  </Row>
              }


            </SubmitForm>
          </div>
        </Modal>


        <Modal
          title="充值"
          visible={this.state.payModalVisible}
          footer={null}
          onCancel={this._hidepayModal}
          className='noPadding'
        >

          <div className='flex-center' style={{ padding: '50px' }}>
            <div style={{ background: '#F2F2F2', padding: '0 20px' }}>
              <div style={{ display: 'flex', marginBottom: '10px', justifyContent: 'space-around' }}>
                <Radio.Group name="radiogroup" defaultValue={1} onChange={this.onExportQuantityUnlimited}>
                  <Radio value={1}>购买</Radio>
                  <Radio value={2}>买断</Radio>
                </Radio.Group>
              </div>
              <div className='line-height40 margin-top'>
                <span className='label-color label-required'>添加数量：</span>
                <input
                  value={this.state.totalExportQuantity}
                  placeholder='请输入'
                  onChange={this.onNumChange}
                  precision={0}
                  disabled={this.state.radioValue == 2}
                  style={{ height: '32px', textIndent: '10px' }}
                />
              </div>

              <Button type='primary' style={{ width: '100%', margin: '40px 0 10px 0' }}
                onClick={this.clickPay}
              >充值
              </Button>
            </div>
          </div>
        </Modal>

      </CommonPage >
    )
  }
}

export default Form.create()(Page);