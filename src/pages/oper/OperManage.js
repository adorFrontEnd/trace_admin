import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Select, Col, Row, Icon, Button, Divider, Popconfirm, Modal, Checkbox, InputNumber } from "antd";
import { pagination } from '../../utils/pagination';
import Toast from '../../utils/toast';
import { deleteOper, getOperPage, saveOrUpdate, disableStatus } from '../../api/oper/oper';
import { searchRoleList } from '../../api/roleManage/roleManage';
import { SearchForm, SubmitForm } from '../../components/common-form';
import dateUtil from '../../utils/dateUtil';


const _title = "操作员管理";
const _description = "";
const { Option } = Select;
class Page extends Component {

  state = {
    operList: null,
    showTableLoading: false,
    newItemModalVisible: false,
    editItemModalVisible: false,
    selectOper: null,
    roleList: [],
    roleId: null

  }

  componentDidMount() {
    this.getPageData();
    this.getRoleList()
  }

  params = {
    page: 1
  }
  // 获取角色
  getRoleList = () => {
    searchRoleList()
    .then(res => {
      if (res && res.data && res.data.length) {
        let roleList = res.data.filter(item => item.name != '超级管理员');
        this.setState({
          roleList
        })
        this.newItemFormList[3].optionList = roleList;
      }
    })
  }

  // 获取页面列表
  getPageData = () => {
    let _this = this;
    this._showTableLoading();
    getOperPage(this.params).then(res => {
      this._hideTableLoading();
      let _pagination = pagination(res, (current) => {
        this.params.page = current
        _this.getPageData();
      }, (cur, pageSize) => {
        this.params.page = 1;
        this.params.size = pageSize
        _this.getPageData();
      })

      this.setState({
        operList: res.data,
        pagination: _pagination
      })
    }).catch(() => {
      this._hideTableLoading();
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
  // 删除
  deleteTableItem = (item) => {
    let { id } = item;
    deleteOper({ id })
      .then(() => {
        Toast("删除成功！", "success");
        this.getPageData();
      })
  }
  // 编辑
  editTableItem = (selectOper) => {
    this.setState({
      selectOper
    })
    this._showEditItemModal(selectOper)
  }
  // 禁用
  deactiveStatus = (record) => {
    let { id } = record;
    let status = '0';
    disableStatus({ id, status })
      .then(() => {
        Toast("禁用成功！", "success");
        this.getPageData();
      })
  }

  // 激活
  activeStatus = (record) => {
    let { id } = record;
    let status = '1';
    disableStatus({ id, status })
      .then(() => {
        Toast("激活成功！", "success");
        this.getPageData();
      })
  }

  // 表格相关列
  columns = [
    { title: "账号", dataIndex: "username" },
    { title: "角色", dataIndex: "roleName" },
    { title: "状态", dataIndex: "status", render: data => data == '1' ? "可用" : "禁用" },
    { title: "创建时间", dataIndex: "createTime", render: data => data ? dateUtil.getDateTime(data) : "--" },
    {
      title: '操作',
      render: (text, record, index) => (
        <span>
          {
            record.roleName != '超级管理员' ?
              <span>
                <a onClick={() => { this.editTableItem(record) }}>编辑</a>
                <Divider type="vertical" />
                {
                  record.status == '1' ?
                    <Popconfirm
                      placement="topLeft" title='确认要禁用吗？'
                      onConfirm={() => { this.deactiveStatus(record) }} >
                      <a size="small">禁用</a>
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
                  <a size="small" className='color-red'>删除</a>
                </Popconfirm>
              </span> : '--'
          }
        </span>
      )
    }
  ]

  _hideNewItemModal = () => {
    this.setState({
      newItemModalVisible: false
    })
  }

  // 新增/编辑表单
  newItemFormList = [
    {
      type: "INPUT",
      field: "username",
      label: "账号:",
      placeholder: "请输入账号",
      rules: [
        { required: true, message: '请输入账号!' }
      ]
    },
    {
      type: "INPUT",
      field: "nickname",
      label: "昵称:",
      placeholder: "请输入昵称",
      rules: [
        { required: true, message: '请输入昵称!' }
      ]
    },
    {
      type: "INPUT",
      field: "password",
      label: "密码:",
      placeholder: "请输入密码",
      rules: [
        { required: true, message: '请输入密码!' },
        { min: 6, message: '请输入至少6位数的密码!' },
        { max: 12, message: '请输入最大12位数的密码!' }
      ]
    },
    {
      type: "SELECT",
      field: "roleId",
      label: "请选择角色:",
      placeholder: "请选择角色名称",
      optionList: [],
      rules: [
        { required: true, message: '请选择角色名称!' }
      ]
    }
  ]
 
  // 点击新增
  newItemModalSaveClicked = (data) => {
    let { roleId } = data
    roleId = roleId.key;
    let title = '添加操作员成功！';
    let params = { ...data,roleId  }
    if (this.state.selectOper) {
      let { id } = this.state.selectOper;
      params.id = id;
      title = '修改成功！'
    }
    saveOrUpdate(params)
      .then(() => {
        Toast(title, "success");
        this._hideNewItemModal();
        this.getPageData();
      })
  }
  _showEditItemModal = (data) => {
    let selectOper = data || null;
      this.newItemFormList[0].disabled = !!data;
      this.newItemFormList[2].rules = data ? null : [{ required: true, message: '请输入密码!' }];
      let editFormValue = {};
      if (data) {
        let {username, password ,nickname,roleName,roleId} = data;
        roleId = { key: roleId, label: roleName };
        
        editFormValue = { username, password: null,nickname,roleId};
      }
      if (!data ) {
        editFormValue = { ...editFormValue}
      }
    this.setState({
      newItemModalVisible: true,
      editFormValue,
      selectOper
    })
  }


  onChange = (value) => {
    this.setState({
      roleId: value
    })

  }
  /**渲染**********************************************************************************************************************************/

  render() {
    const { getFieldDecorator } = this.props.form;
    // const { roleList } = this.state;
    return (
      <CommonPage title={_title} description={_description} >
        <div className='padding20'>
          <Button type='primary' onClick={() => { this._showEditItemModal() }}>添加操作员</Button>
        </div>
        <Table
          indentSize={10}
          rowKey="id"
          columns={this.columns}
          loading={this.state.showTableLoading}
          pagination={this.state.pagination}
          dataSource={this.state.operList}
        />
        <Modal
          title="添加/编辑操作员"
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
              
            </SubmitForm>
          </div>
        </Modal>

      </CommonPage >
    )
  }
}

export default Form.create()(Page);