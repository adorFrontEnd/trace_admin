import React, { Component } from "react";
import {Form, Tree, Icon, Spin} from "antd";

import { getAllRouter } from '../../router/routerParse';
import { getAllList } from '../../api/roleManage/roleManage';
import Toast from "../../utils/toast";

const TreeNode = Tree.TreeNode;


class AuthSelection extends Component {

  state = {
    roleList: [],
    authTree: [],
    selectId: null,
    selectRoleAuth: null,
    authLoading: false,
    canRenderTree: false
  }

  componentDidMount() {
    this._getAllAuthList();
  }

  _getAllAuthList = () => {

    this.setState({
      authLoading: true
    })

    getAllList()
      .then(data => {
        let allAuthList = data.map(item => item.source)
        let authTree = getAllRouter(allAuthList);
        console.log(authTree)
        this.setState({
          authTree,
          canRenderTree: true,
          authLoading: false
        })
      })
      .catch(() => {
        this.setState({
          canRenderTree: true,
          authLoading: false
        })
      })
  }

  selectRole = (id) => {
    let arr = [];
    if (!this.state.roleList || !this.state.roleList.length) {
      return;
    }
    if (!id) {
      arr = this.state.roleList;
    } else {
      arr = this.state.roleList.filter(item => item.id == id);
    }
    let selectRoleAuth = arr[0].models ? arr[0].models.split(',') : [];
    this.setState({
      selectId: arr[0].id,
      selectRoleAuth
    })
  }

  onCheck = (checkedKeys, info) => {
    this.setState({
      selectRoleAuth: checkedKeys
    })

    this.props.onCheckedChange(checkedKeys);
  }

  saveAuthClick = (id) => {
    if (id == this.state.selectId) {
      let arr = this.state.selectRoleAuth.filter(item => item.indexOf('.') != -1 || item == 'home')
      let models = arr.join(',');
      let params = { id, models }
      this.setState({
        authLoading: true
      })
    }
  }


  // 左侧的菜单渲染
  renderTreeNode = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key}>
            {this.renderTreeNode(item.children)}
          </TreeNode>
        )
      }
      return (
        <TreeNode title={item.title} key={item.key} />
      )
    })
  }

  renderTree = () => {
    if (this.state.canRenderTree && this.state.authTree) {
      return (
        <Tree
          showIcon
          checkedKeys={this.props.selectRoleAuth || []}
          defaultExpandAll={false}
          checkable
          onSelect={this.onSelect}
          onCheck={this.onCheck}
        >
          <TreeNode icon={<Icon type="deployment-unit" />} title="所有权限" key="all">
            {
              this.renderTreeNode(this.state.authTree)
            }
          </TreeNode>
        </Tree>
      )
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Spin spinning={this.state.authLoading}>
          <div className='border-e8'>
            {
              this.renderTree()
            }
          </div>
        </Spin>
      </div>
    )
  }
}



export default Form.create()(AuthSelection);


